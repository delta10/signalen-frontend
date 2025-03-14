// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2025 Delta10
import { useEffect } from 'react'

import styled from 'styled-components'

import useFetchRelatedSignals from '../hooks/useFetchRelatedSignals'

interface RelatedSignalsCountProps {
  id: number
}

const RelatedSignalsCount: React.FC<RelatedSignalsCountProps> = ({ id }) => {
  const {
    data: getRelatedSignalsData,
    get: getRelatedSignals,
    isLoading: getRelatedSignalsIsLoading,
  } = useFetchRelatedSignals()

  useEffect(() => {
    if (id) {
      getRelatedSignals(id)
    }
  }, [getRelatedSignals, id])

  if (getRelatedSignalsIsLoading) {
    return null
  }

  if (!getRelatedSignalsData || getRelatedSignalsData.length == 0) {
    return null
  }

  return <> ({getRelatedSignalsData.length} gekoppeld)</>
}

export const StyledFieldset = styled.span``

export default RelatedSignalsCount
