import { setup as envRun } from '@skyra/env-utilities';

export function setup() {
	envRun(new URL('../../../src/.env', import.meta.url));
}
