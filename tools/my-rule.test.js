const { RuleTester } = require("eslint");
const rule = require("./my-rule");

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run("my-rule", rule, {
    valid: [
        {
            code: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
`,
        },
        {
            code: `
import {selectDeliveryDate} from '../../selectors';

import type {ExperimentFlag} from '.';
`,
        },
        {
            code: `
import {selectDeliveryDate} from '../../selectors';

import type {ExperimentFlag} from '.';
import {calcDeliveryDate} from './helpers';
`,
        },
        {
            code: `
import { ClientBus, subscribe } from "@yandex-nirvana/bus";

import { call } from "typed-redux-saga";
`,
        },
        {
            code: `
import { ClientBus, subscribe } from "@yandex-nirvana/bus";

import { call } from "typed-redux-saga";

import {selectDeliveryDate} from '../../selectors';

import {calcDeliveryDate} from './helpers';
`,
        },
        {
            code: `
import { call } from "typed-redux-saga";

import { pluralize } from "../../../../lib/utils";
`,
        },
        {
            code: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const dynamic = import("my-dynamic-import");
`,
        },
        {
            code: `
import {defaultConfig} from "@shri2023/config";

import _ from 'lodash';

import {pluralize} from "../../../../lib/utils";

import {calcDeliveryDate} from './helpers';
`,
        },
        {
            code: `
import {serviceSlug} from "@abc";
import {solutions} from "@shri2023/solutions";
import {hermione} from "@yandex";
            `,
        },
        {
            code: `
// This module is imported for commons good
import * as lodash from "lodash";

import {relative} from "../../relative-package";
`,
        },
        {
            code: `
/**
 * This module is imported
 * for commons good
 */
import * as lodash from "lodash";

import {relative} from "../../relative-package";
`,
        },
        {
            code: `
import * as lodash from "lodash";

// This module is imported for commons good
// This module is imported for commons good
// This module is imported for commons good
import {relative} from "../../relative-package";
`,
        },
        {
            code: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

if(true) {
    const dynamic = import("my-dynamic-import");
    const dynamic2 = import("my-dynamic-import2");
}
`,
        },
    ],
    invalid: [
        {
            code: `
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
`,
            output: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import type {ExperimentFlag} from '.';
import {selectDeliveryDate} from '../../selectors';
`,
            output: `
import {selectDeliveryDate} from '../../selectors';
import type {ExperimentFlag} from '.';
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import {selectDeliveryDate} from '../../selectors';
import {calcDeliveryDate} from './helpers';
import type {ExperimentFlag} from '.';
`,
            output: `
import {selectDeliveryDate} from '../../selectors';
import type {ExperimentFlag} from '.';
import {calcDeliveryDate} from './helpers';
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import { call } from "typed-redux-saga";
import { ClientBus, subscribe } from "@yandex-nirvana/bus";
`,
            output: `
import { ClientBus, subscribe } from "@yandex-nirvana/bus";
import { call } from "typed-redux-saga";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import { ClientBus, subscribe } from "@yandex-nirvana/bus";
import { call } from "typed-redux-saga";
import {selectDeliveryDate} from '../../selectors';
import {calcDeliveryDate} from './helpers';
`,
            output: `
import { ClientBus, subscribe } from "@yandex-nirvana/bus";
import { call } from "typed-redux-saga";
import {selectDeliveryDate} from '../../selectors';
import {calcDeliveryDate} from './helpers';
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import { pluralize } from "../../../../lib/utils";
import { call } from "typed-redux-saga";
`,
            output: `
import { call } from "typed-redux-saga";
import { pluralize } from "../../../../lib/utils";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import fs from 'fs';
const dynamic = import("my-dynamic-import");
import _ from 'lodash';
import path from 'path';
`,
            output: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
const dynamic = import("my-dynamic-import");
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import {pluralize} from "../../../../lib/utils";
import {calcDeliveryDate} from './helpers';
import {defaultConfig} from "@shri2023/config";
import _ from 'lodash';
`,
            output: `
import {defaultConfig} from "@shri2023/config";
import _ from 'lodash';
import {pluralize} from "../../../../lib/utils";
import {calcDeliveryDate} from './helpers';
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import {hermione} from "@yandex";
import {solutions} from "@shri2023/solutions";
import {serviceSlug} from "@abc";
`,
            output: `
import {serviceSlug} from "@abc";
import {solutions} from "@shri2023/solutions";
import {hermione} from "@yandex";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import {relative} from "../../relative-package";
// This module is imported for commons good
import * as lodash from "lodash";
`,
            output: `
// This module is imported for commons good
import * as lodash from "lodash";
import {relative} from "../../relative-package";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import {relative} from "../../relative-package";
/**
 * This module is imported
 * for commons good
 */
import * as lodash from "lodash";
`,
            output: `
/**
 * This module is imported
 * for commons good
 */
import * as lodash from "lodash";
import {relative} from "../../relative-package";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
// This module is imported for commons good
// This module is imported for commons good
// This module is imported for commons good
import {relative} from "../../relative-package";
import * as lodash from "lodash";
`,
            output: `
import * as lodash from "lodash";
// This module is imported for commons good
// This module is imported for commons good
// This module is imported for commons good
import {relative} from "../../relative-package";
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
        {
            code: `
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
if(true) {
    const dynamic = import("my-dynamic-import");
    const dynamic2 = import("my-dynamic-import2");
}
`,
            output: `
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

if(true) {
    const dynamic = import("my-dynamic-import");
    const dynamic2 = import("my-dynamic-import2");
}
`,
            errors: [
                {
                    type: "ImportDeclaration",
                },
            ],
        },
    ],
});
