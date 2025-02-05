import { translators } from '@mirrorful/core/lib/translators'
import { TConfig, TExportFileType } from '@mirrorful/core/lib/types'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

import { rootPath, store } from '../../store/store'

const generateStorageFile = async ({ tokens, files }: TConfig) => {
  store.set('tokens', tokens)
  store.set('files', files)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config = JSON.parse(req.body) as TConfig // TODO: Validate request body

  await generateStorageFile(config)

  for (const fileType of config.files) {
    const translator = translators[fileType as TExportFileType]

    const fileName = `${rootPath}/theme${translator.extension}`
    const content = translator.toContent(config.tokens)

    fs.writeFileSync(fileName, content)
  }

  return res.status(200).json({ message: 'Success' })
}
