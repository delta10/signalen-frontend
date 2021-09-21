// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import FileInputComponent from 'components/FileInput'
import { FunctionComponent, useCallback, useState } from 'react'
import { useController } from 'react-hook-form'
import fileSize from 'signals/incident/services/file-size'
import { FieldProps } from '../../types'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 8 * 2 ** 20 // 8 MiB
const MAX_NUMBER_OF_FILES = 3
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const ALLOWED_EXTENSIONS = ALLOWED_FILE_TYPES.map((type) => type.split('/')[1])

const FileInput: FunctionComponent<FieldProps> = ({
  errorMessage,
  id,
  label,
  trigger,
  control,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const controller = useController({
    control,
    name: id,
    defaultValue: [],
    rules: {
      validate: {
        fileType: (files: File[]) => {
          if (files.find((file) => !ALLOWED_FILE_TYPES.includes(file.type))) {
            return `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${ALLOWED_EXTENSIONS.join(
              ', '
            )}`
          }
        },
        numberOfFiles: (files: File[]) => {
          if (files.length > MAX_NUMBER_OF_FILES)
            return `U kunt maximaal ${MAX_NUMBER_OF_FILES} bestanden uploaden`
        },
        minFileSize: (files: File[]) =>
          files.find((file) => file.size < MIN) &&
          `Dit bestand is te klein. De minimale bestandgrootte is ${fileSize(
            MIN
          )}.`,
        maxFileSize: (files: File[]) =>
          files.find((file) => file.size > MAX) &&
          `Dit bestand is te groot. De minimale bestandgrootte is ${fileSize(
            MAX
          )}.`,
      },
    },
  })

  const handleChange = useCallback(
    (files: File[]) => {
      controller.field.onChange(files)
      setFiles(files)
      trigger(id)
    },
    [controller.field, id, trigger]
  )

  return (
    <FileInputComponent
      name={id}
      label={label}
      helpText="Voeg een foto toe om de situatie te verduidelijken."
      errorMessages={errorMessage ? [errorMessage] : []}
      onChange={handleChange}
      files={files}
    />
  )
}

export default FileInput