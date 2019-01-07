/**
 * Arn Utility
 *
 */
const assert = require('assert');
const _ = require('lodash');
const wildcardMatch = require('wildcard-match');

let arnHeader = 'arn';

let arnArtifacts = {
  tenant: 'tenant',
  service: 'service',
  permission: 'permission',
  role: 'role',
  user: 'user'
};

class ARN {
  constructor(artifact, id, resource, qualifier) {
    this.artifact = artifact;
    this.id = id;
    this.resource = resource;
    this.qualifier = qualifier;
  }

  static getHeader() { return arnHeader; }

  static setHeader(header) { arnHeader = header; }

  static getArtifacts() { return arnArtifacts; }

  static setArtifacts(artifacts) { arnArtifacts = artifacts; }

  static parse(arnString) {
    assert(arnString, 'ARN string must be non null string');

    const arn = new ARN();
    const parts = arnString.split(':');
    assert.strictEqual(parts.length, 4, 'Invalid ARN format');
    const header = parts[0];
    const artifact = parts[1];
    const id = parts[2];
    const resource = parts[3];

    assert.strictEqual(header, ARN.getHeader(), 'Invalid ARN header');
    arn.artifact = artifact;
    arn.id = id;

    const resources = resource.split('/');
    [arn.resource] = resources;
    if (resources.length > 1) {
      [, arn.qualifier] = resources;
    }
    return arn;
  }

  toString() {
    const stringARN = [ARN.getHeader(), this.artifact, this.id, this.resource];
    return stringARN.join(':') + (this.qualifier ? `/${this.qualifier}` : '');
  }

  matchArtifact(artifact) {
    assert(artifact, 'Artifact should not be undefined');
    assert(!_.isEmpty(artifact), 'Artifact should not be empty string');
    return wildcardMatch(this.artifact, artifact);
  }

  matchId(id) {
    assert(id, 'Id should not be undefined');
    assert(!_.isEmpty(id), 'Id should not be empty string');
    return wildcardMatch(this.id, id);
  }

  matchResource(resource) {
    assert(resource, 'Resource should not be undefined');
    assert(!_.isEmpty(resource), 'Resource should not be empty string');
    return wildcardMatch(this.resource, resource);
  }

  matchQualifier(qualifier) {
    assert(qualifier, 'Qualifier should not be undefined');
    assert(!_.isEmpty(qualifier), 'Qualifier should not be empty string');
    return wildcardMatch(this.qualifier, qualifier);
  }

  matchRnQ(resource, qualifier) {
    return this.matchResource(resource) && this.matchQualifier(qualifier);
  }
}

module.exports = {
  ARN
};
