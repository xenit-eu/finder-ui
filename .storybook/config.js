import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

addDecorator(withA11y);
addDecorator(withKnobs);
