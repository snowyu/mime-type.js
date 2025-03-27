import mimeDb from './mime-db'
import { MimeType } from '.'

export const mimeType = new MimeType(mimeDb, MimeType.dupAppend)
export default mimeType
export { MimeType }