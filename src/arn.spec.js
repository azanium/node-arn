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
    ARN.setHeader(headerString);
    const header = ARN.getHeader(headerString);
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
    expect(arn).toEqual(`${ARN.getHeader()}:${artifact}:${id}:${resource}`);
  });

  it('should create ARN with qualifier', () => {
    const arn = new ARN(artifact, id, resource, qualifier).toString();
    expect(arn).toEqual(`${ARN.getHeader()}:${artifact}:${id}:${resource}/${qualifier}`);
  });

  it('should parse arn from string', () => {
    const arn = ARN.parse(`${ARN.getHeader()}:${artifact}:${id}:${resource}/${qualifier}`);

    expect(arn.artifact).toEqual(artifact);
    expect(arn.id).toEqual(id);
    expect(arn.resource).toEqual(resource);
    expect(arn.qualifier).toEqual(qualifier);
  });

  it('should parse arn from string without qualifier', () => {
    const arn = ARN.parse(`${ARN.getHeader()}:${artifact}:${id}:${resource}`);

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
});
