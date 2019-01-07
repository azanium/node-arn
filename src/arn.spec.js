const { ARN } = require('./arn');

describe('ARN', () => {
  const artifact = 'service';
  const id = '123';
  const resource = 'name';
  const qualifier = 'read';
  beforeEach(() => {});

  afterEach(() => {});

  it('should change header', () => {
    const headerString = 'hello';
    ARN.setDefaultHeader(headerString);
    const header = ARN.getDefaultHeader(headerString);
    expect(header).toEqual(headerString);
  });

  it('should change artifacts', () => {
    const newArtifacts = { service: 'wow' };
    ARN.setArtifacts(newArtifacts);
    const artifacts = ARN.getArtifacts();
    expect(artifacts).toEqual(expect.objectContaining({
      service: newArtifacts.service
    }));
  });

  it('should create ARN without qualifier', () => {
    const arn = new ARN(artifact, id, resource).toString();
    expect(arn).toEqual(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}`);
  });

  it('should create ARN with qualifier', () => {
    const arn = new ARN(artifact, id, resource, qualifier).toString();
    expect(arn).toEqual(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
  });

  it('should parse arn from string', () => {
    const arn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);

    expect(arn.artifact).toEqual(artifact);
    expect(arn.id).toEqual(id);
    expect(arn.resource).toEqual(resource);
    expect(arn.qualifier).toEqual(qualifier);
  });

  it('should parse arn from string without qualifier', () => {
    const arn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}`);

    expect(arn.artifact).toEqual(artifact);
    expect(arn.id).toEqual(id);
    expect(arn.resource).toEqual(resource);
    expect(arn.qualifier).toBe(undefined);
  });

  it('should failed to parse arn from string', () => {
    try {
      ARN.parse('some string');
    } catch (error) {
      expect(error).toHaveProperty('code');
      expect(error).toHaveProperty('actual');
      expect(error).toHaveProperty('expected');
      expect(error.code).toEqual('ERR_ASSERTION');
      expect(error.actual).not.toEqual(error.expected);
    }
  });

  it('should match header', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:${resource}/${qualifier}`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.matchHeader(targetArn.header);
    expect(match).toBe(true);
  });

  it('should match id with wildcard', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:${resource}/${qualifier}`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.matchId(targetArn.id);
    expect(match).toBe(true);
  });

  it('should match resource with wildcard', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:*/${qualifier}`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.matchResource(targetArn.resource);
    expect(match).toBe(true);
  });

  it('should match qualifier with wildcard', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:*/*`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.matchQualifier(targetArn.qualifier);
    expect(match).toBe(true);
  });

  it('should match resource and qualifier with wildcard', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:*/*`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.matchRnQ(targetArn.resource, targetArn.qualifier);
    expect(match).toBe(true);
  });

  it('should match source and target ARN', () => {
    const sourceArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:*:*/*`);
    const targetArn = ARN.parse(`${ARN.getDefaultHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
    const match = sourceArn.match(targetArn);
    expect(match).toBe(true);
  });
});
