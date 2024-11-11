import { setup as envRun } from '@skyra/env-utilities';

import '#lib/setup/i18next';
import '@skyra/shared-http-pieces/register';

export function setup() {
	envRun(new URL('../../../src/.env', import.meta.url));
}
