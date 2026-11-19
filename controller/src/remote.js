import { z } from 'zod'
import { createTypertRemoteInfo } from '@deepseek-ai/dsh-typert-protocol/remote-info'

const provider = z.enum(['bing', 'google', 'deepseek-account', 'deepseek-official', 'configured-model'])
const limits = z.object({
  maxTextChars: z.number(),
  preferences: z.object({ provider, targetLanguage: z.string(), modelRoute: z.string() }),
  availableProviders: z.array(provider),
  modelRoutes: z.array(z.object({ route: z.string(), providerName: z.string(), modelName: z.string() })),
})
const fields = {
  text: z.string(), targetLanguage: z.string(), sourceLanguage: z.string().optional(),
  provider: provider.optional(), sessionId: z.string().optional(), modelRoute: z.string().optional(),
}
const codec = (schema) => ({ mode: 'strict', create: () => schema, get jsonSchema() { return z.toJSONSchema(schema) } })
const common = { service: 'cotTranslation', invocation: { kind: 'direct' }, cancellation: { parameter: 'signal' } }
export const TYPERT_REMOTE = createTypertRemoteInfo({
  package: '@yu1745/dsh-cot-translation',
  methods: {
    'cotTranslation/limits': { ...common, parameters: [], result: codec(limits) },
    'cotTranslation/translate': { ...common, parameters: [{ name: 'request', source: 'json', codec: codec(z.object(fields)), strictCodec: codec(z.strictObject(fields)) }], result: codec(z.string()) },
  },
}, z)
export default TYPERT_REMOTE
