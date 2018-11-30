/**
 * Arn Utility
 *
 */
const assert = require('assert');

let arnHeader = 'aina';

let arnArtifacts = {
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
}

module.exports = {
  ARN
};
