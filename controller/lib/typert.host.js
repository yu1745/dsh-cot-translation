import remote from '../src/remote.js'

export const TYPERT = {
  package: '@yu1745/dsh-cot-translation',
  face: 'host',
  schemas: [],
  get invocations() { return remote.descriptors },
  model: { services: [], events: [], objects: [] },
}
