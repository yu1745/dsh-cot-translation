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
const codec = (schema, type) => ({
  mode: 'strict',
  typeSymbol: `@yu1745/dsh-cot-translation#${type}`,
  create: () => schema,
  get jsonSchema() { return z.toJSONSchema(schema) },
})
const requestCodec = codec(z.object(fields), 'TranslationRequest')
const strictRequestCodec = codec(z.strictObject(fields), 'TranslationRequest')
const common = { service: 'cotTranslation', invocation: { kind: 'direct' }, cancellation: { parameter: 'signal' } }
export const TYPERT_REMOTE = createTypertRemoteInfo({
  package: '@yu1745/dsh-cot-translation',
  methods: {
    'cotTranslation/limits': { ...common, parameters: [], result: codec(limits, 'CotTranslationSnapshot') },
    'cotTranslation/translate': { ...common, parameters: [{ name: 'request', source: 'json', codec: requestCodec, strictCodec: strictRequestCodec }], result: codec(z.string(), 'translate:result') },
  },
}, z)
export default TYPERT_REMOTE
