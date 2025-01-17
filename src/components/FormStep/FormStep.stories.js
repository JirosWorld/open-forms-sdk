import produce from 'immer';
import {getWorker} from 'msw-storybook-addon';
import {withRouter} from 'storybook-addon-react-router-v6';
import {v4 as uuid4} from 'uuid';

import {buildForm, buildSubmission} from 'api-mocks';
import {ConfigDecorator} from 'story-utils/decorators';

import FormStep from '.';
import {
  getSubmissionStepDetail,
  mockSubmissionLogicCheckPost,
  mockSubmissionStepGet,
} from './mocks';

export default {
  title: 'Private API / FormStep',
  component: FormStep,
  decorators: [ConfigDecorator, withRouter],
  argTypes: {
    submission: {control: false},
    form: {control: false},
    routerArgs: {table: {disable: true}},
  },
  parameters: {
    config: {
      debug: false,
    },
    reactRouter: {
      routePath: '/stap/:step',
      routeParams: {step: 'step-1'},
    },
  },
};

const worker = getWorker();

const render = ({
  // component props
  form,
  submission,
  onLogicChecked,
  onStepSubmitted,
  onLogout,
  onSessionDestroyed,
  // story args
  formioConfiguration,
}) => {
  // force mutation/re-render by using different step URLs every time
  submission = produce(submission, draftSubmission => {
    for (const step of draftSubmission.steps) {
      step.url = `${draftSubmission.url}/steps/${uuid4()}`;
    }
  });
  const submissionStepDetailBody = getSubmissionStepDetail({
    formioConfiguration: formioConfiguration,
  });
  worker.resetHandlers();
  worker.use(
    mockSubmissionStepGet(submissionStepDetailBody),
    mockSubmissionLogicCheckPost(submission, submissionStepDetailBody)
  );
  return (
    <FormStep
      form={form}
      submission={submission}
      onLogicChecked={onLogicChecked}
      onStepSubmitted={onStepSubmitted}
      onLogout={onLogout}
      onSessionDestroyed={onSessionDestroyed}
    />
  );
};

export const Default = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
  },
};

export const SuspensionDisallowed = {
  name: 'Suspension disallowed',
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm({suspensionAllowed: false}),
    submission: buildSubmission(),
  },
};
