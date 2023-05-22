// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type {
  CategoryFormValues,
  CategoryFormPayload,
  DirtyFields,
} from '../types'

export const getPatchPayload = (
  formData: CategoryFormValues,
  dirtyFields: DirtyFields
): CategoryFormPayload => {
  const payload = Object.keys(dirtyFields).map((key) => {
    return {
      [key]: formData[key as keyof CategoryFormValues],
    }
  })

  const payloadObject = Object.assign({}, ...payload)

  const payloadResult = {
    ...payloadObject,
    ...(('n_days' in payloadObject || 'use_calendar_days' in payloadObject) && {
      new_sla: {
        n_days: payloadObject.n_days ?? formData.n_days,
        use_calendar_days: Boolean(Number(payloadObject.use_calendar_days)),
      },
    }),
    ...('show_children_in_filter' in payloadObject && {
      configuration: {
        show_children_in_filter: payloadObject.show_children_in_filter,
      },
    }),
  }

  delete payloadResult['n_days']
  delete payloadResult['use_calendar_days']
  delete payloadResult['show_children_in_filter']

  return payloadResult
}