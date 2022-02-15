// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { WithWizard } from 'react-albus'
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'

import PreviousButton from 'components/PreviousButton'
import NextButton from 'components/NextButton'

import type { FC, SyntheticEvent } from 'react'
import type {
  FormAction,
  WizardSection,
} from 'signals/incident/definitions/wizard'

const Nav = styled.div`
  align-items: center;
  background-color: ${themeColor('tint', 'level3')};
  display: flex;
  flex-direction: row-reverse;
  height: ${themeSpacing(16)};
  justify-content: space-between;
  margin-top: ${themeSpacing(7)};
  padding: ${themeSpacing(0, 4)};

  type=[button] {
    order: 1;
  }

  type=[submit] {
    order: 0;
  }
`

interface IncidentNavigationProps {
  meta: {
    wizard: WizardSection
    handleSubmit: (
      event: SyntheticEvent<HTMLButtonElement>,
      next: () => void,
      formAction?: FormAction
    ) => void
  }
}

const IncidentNavigation: FC<IncidentNavigationProps> = ({ meta }) => {
  const { wizard, handleSubmit } = meta

  return (
    <WithWizard
      render={({ next, previous, step }) => {
        const currentStep = step?.id?.split('/').pop() as keyof WizardSection
        const wizardStep = currentStep !== 'bedankt' && wizard[currentStep]

        if (!wizardStep) return null

        return (
          wizardStep && (
            <Nav className="incident-navigation">
              {wizardStep.nextButtonLabel && (
                <NextButton
                  onClick={(e) => handleSubmit(e, next, wizardStep.formAction)}
                  data-testid="nextButton"
                >
                  <span className="value">{wizardStep.nextButtonLabel}</span>
                </NextButton>
              )}

              {wizardStep.previousButtonLabel ? (
                <PreviousButton
                  className={wizardStep.previousButtonClass}
                  onClick={previous}
                  data-testid="previousButton"
                >
                  {wizardStep.previousButtonLabel}
                </PreviousButton>
              ) : (
                <span />
              )}
            </Nav>
          )
        )
      }}
    />
  )
}

export default IncidentNavigation