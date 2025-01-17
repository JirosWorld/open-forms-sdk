import {STEP_LABELS} from 'components/constants';
import {checkMatchesPath} from 'components/utils/routers';
import {IsFormDesigner} from 'headers';

const canNavigateToStep = (index, submission) => {
  // The user can navigate to a step when:
  // 1. All previous steps have been completed
  // 2. The user is a form designer
  if (IsFormDesigner.getValue()) return true;

  if (!submission) return false;

  const previousSteps = submission.steps.slice(0, index);
  const previousApplicableButNotCompletedSteps = previousSteps.filter(
    step => step.isApplicable && !step.completed
  );

  return !previousApplicableButNotCompletedSteps.length;
};

const getStepsInfo = (formSteps, submission, currentPathname) => {
  return formSteps.map((step, index) => ({
    to: `/stap/${step.slug}`,
    label: step.formDefinition,
    isCompleted: submission ? submission.steps[index].completed : false,
    isApplicable: submission ? submission.steps[index].isApplicable : step.isApplicable ?? true,
    isCurrent: checkMatchesPath(currentPathname, step.slug),
    canNavigateTo: canNavigateToStep(index, submission),
  }));
};

const addFixedSteps = (
  intl,
  steps,
  submission,
  currentPathname,
  showOverview,
  showConfirmation,
  completed = false
) => {
  const hasSubmission = !!submission;
  const isConfirmation = checkMatchesPath(currentPathname, 'bevestiging');
  const applicableSteps = hasSubmission ? submission.steps.filter(step => step.isApplicable) : [];
  const applicableAndCompletedSteps = applicableSteps.filter(step => step.completed);
  const applicableCompleted =
    hasSubmission && applicableSteps.length === applicableAndCompletedSteps.length;

  const startPageStep = {
    to: 'startpagina',
    label: intl.formatMessage(STEP_LABELS.login),
    isCompleted: hasSubmission,
    isApplicable: true,
    canNavigateTo: true,
    isCurrent: checkMatchesPath(currentPathname, 'startpagina'),
  };

  const summaryStep = {
    to: 'overzicht',
    label: intl.formatMessage(STEP_LABELS.overview),
    isCompleted: isConfirmation,
    isApplicable: true,
    isCurrent: checkMatchesPath(currentPathname, 'overzicht'),
    canNavigateTo: applicableCompleted,
  };

  const confirmationStep = {
    to: 'bevestiging',
    label: intl.formatMessage(STEP_LABELS.confirmation),
    isCompleted: completed,
    isCurrent: checkMatchesPath(currentPathname, 'bevestiging'),
  };

  const finalSteps = [
    startPageStep,
    ...steps,
    showOverview && summaryStep,
    showConfirmation && confirmationStep,
  ].filter(Boolean);

  return finalSteps;
};

export {addFixedSteps, getStepsInfo};
