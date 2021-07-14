import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, Link } from 'react-router-dom';

import Anchor from './Anchor';
import Card from './Card';
import Caption from './Caption';
import List from './List';
import FAIcon from './FAIcon';
import { getBEMClassName } from './utils';


const getLinkModifiers = (active, available, completed) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : undefined,
    available ? undefined : 'muted',
    completed ? undefined : 'indent',
  ].filter( mod => mod !== undefined );
};


const LinkOrDisabledAnchor = ({ to, useLink, children, ...props }) => {
  if (useLink) {
    return <Link to={to} component={Anchor} {...props}>{children}</Link>
  }
  return <Anchor component="span" {...props}>{children}</Anchor>
};

LinkOrDisabledAnchor.propTypes = {
  to: PropTypes.string.isRequired,
  useLink: PropTypes.bool.isRequired,
};


const SidebarStepStatus = ({isCurrent, step, available=false, completed=false}) => {
  const icon = completed ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null;
  const linkText = ` ${step.formDefinition}`; // space required between icon and text
  const modifiers = getLinkModifiers(isCurrent, available, completed);
  return (
    <LinkOrDisabledAnchor to={`/stap/${step.slug}`} useLink={available} modifiers={modifiers}>
      {icon}
      {linkText}
    </LinkOrDisabledAnchor>
  );
};


SidebarStepStatus.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  available: PropTypes.bool,
  step: PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  }),
};



const stepLabels = {
  login: 'Inloggen',
  overview: 'Overzicht',
  confirmation: 'Bevestiging',
};


const ProgressIndicator = ({ title, submission, steps }) => {
  const summaryMatch = useRouteMatch("/overzicht");
  const stepMatch = useRouteMatch("/stap/:step");
  const confirmationMatch = useRouteMatch("/bevestiging");
  const isStartPage = summaryMatch == null && stepMatch == null && confirmationMatch == null;

  const [expanded, setExpanded] = useState(false);

  // figure out the slug from the currently active step IF we're looking at a step
  const stepSlug = stepMatch ? stepMatch.params.step : '';
  const hasSubmission = !!submission;

  // all steps are completed if we cannot find a single step that isn't completed
  const allCompleted = submission
    ? submission.steps.find(step => !step.completed) === undefined
    : false;

  // figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (isStartPage) {
    activeStepTitle = stepLabels.login;
  } else if (!!summaryMatch) {
    activeStepTitle = stepLabels.overview;
  } else if (!!confirmationMatch) {
    activeStepTitle = stepLabels.configuration;
  } else {
    const step = steps.find( step => step.slug === stepSlug);
    activeStepTitle = step.formDefinition;
  }

  return (
    <Card blockClassName="progress-indicator" modifiers={expanded ? [] : ['mobile-collapsed']}>

      <div className={getBEMClassName('progress-indicator__mobile-header')} onClick={() => setExpanded(!expanded)}>
        <FAIcon icon={expanded ? 'chevron-up' : 'chevron-down' } modifiers={['normal']} />
        <span className={getBEMClassName('progress-indicator__active-step')}>
          {activeStepTitle}
        </span>
      </div>

      <Caption component="h3">{title}</Caption>

      <List ordered>
        <Anchor href="#" modifiers={getLinkModifiers(isStartPage, true, hasSubmission)}>
          { hasSubmission ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null }
          {` ${stepLabels.login}`}
        </Anchor>
        {
          steps.map( (step, index) => (
            <SidebarStepStatus
              key={step.uuid}
              step={step}
              completed={submission ? submission.steps[index].completed : false}
              available={submission ? submission.steps[index].available : false}
              isCurrent={step.slug === stepSlug}
              slug={step.slug}
            />
          ) )
        }
        <LinkOrDisabledAnchor
          to={'/overzicht'}
          useLink={allCompleted}
          modifiers={getLinkModifiers(!!summaryMatch, allCompleted && !hasSubmission, false)}
        >{` ${stepLabels.overview}`}</LinkOrDisabledAnchor>
        <Anchor
          component="span"
          modifiers={getLinkModifiers(!!confirmationMatch, allCompleted, false)}
        >{` ${stepLabels.confirmation}`}</Anchor>
      </List>
    </Card>
  );
};


ProgressIndicator.propTypes = {
  title: PropTypes.string,
  submission: PropTypes.shape({
    steps: PropTypes.arrayOf(PropTypes.shape({
      completed: PropTypes.bool.isRequired,
      available: PropTypes.bool.isRequired,
      // and more...
    })),
  }),
  steps: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  })).isRequired,
};


export default ProgressIndicator;
