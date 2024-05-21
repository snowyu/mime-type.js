import db from 'mime-db'
import { MimeType } from '.'

export const mimeType = new MimeType(db)
export default mimeType
export { MimeType }