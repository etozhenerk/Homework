const testData = [
  {
    input: `import fs from 'fs';
    import path from 'path';

    import _ from 'lodash';`,
    output: `import fs from 'fs';
    import _ from 'lodash';
    import path from 'path';`
  },
  {
    input: `import type {ExperimentFlag} from '.';
    import {selectDeliveryDate} from '../../selectors';`,
    output: `import {selectDeliveryDate} from '../../selectors';

    import type {ExperimentFlag} from '.';`
  },
  {
    input: `import {selectDeliveryDate} from '../../selectors';
    import {calcDeliveryDate} from './helpers';
    import type {ExperimentFlag} from '.';`,
    output: `import {selectDeliveryDate} from '../../selectors';

    import type {ExperimentFlag} from '.';
    import {calcDeliveryDate} from './helpers';`
  },
  {
    input: `import { call } from "typed-redux-saga";
    import { ClientBus, subscribe } from "@yandex-nirvana/bus";`,
    output: `import { ClientBus, subscribe } from "@yandex-nirvana/bus";

    import { call } from "typed-redux-saga";`
  },
  {
    input: `import { ClientBus, subscribe } from "@yandex-nirvana/bus";

    import { call } from "typed-redux-saga";

    import {selectDeliveryDate} from '../../selectors';

    import {calcDeliveryDate} from './helpers';`,
    output: `import { ClientBus, subscribe } from "@yandex-nirvana/bus";

    import { call } from "typed-redux-saga";

    import {selectDeliveryDate} from '../../selectors';

    import {calcDeliveryDate} from './helpers';`
  },
  {
    input: `import { pluralize } from "../../../../lib/utils";

    import { call } from "typed-redux-saga";`,
    output: `import { call } from "typed-redux-saga";

    import { pluralize } from "../../../../lib/utils";`
  },
  {
    input: `import fs from 'fs';
    const dynamic = import("my-dynamic-import");
    import _ from 'lodash';
    import path from 'path';`,
    output: `import fs from 'fs';
    import _ from 'lodash';
    import path from 'path';

    const dynamic = import("my-dynamic-import");`
  },
  {
    input: `import {pluralize} from "../../../../lib/utils";
    import {calcDeliveryDate} from './helpers';
    import {defaultConfig} from "@shri2023/config";
    import _ from 'lodash';`,
    output: `import {defaultConfig} from "@shri2023/config";

    import _ from 'lodash';

    import {pluralize} from "../../../../lib/utils";

    import {calcDeliveryDate} from './helpers';`
  },
  {
    input: `import {hermione} from "@yandex";
    import {solutions} from "@shri2023/solutions";
    import {serviceSlug} from "@abc";`,
    output: `import {serviceSlug} from "@abc";
    import {solutions} from "@shri2023/solutions";
    import {hermione} from "@yandex";`
  },
  {
    input: `import {relative} from "../../relative-package";

    // This module is imported for commons good
    import * as lodash from "lodash";`,
    output: `// This module is imported for commons good
    import * as lodash from "lodash";

    import {relative} from "../../relative-package";`
  },
  {
    input: `import {relative} from "../../relative-package";

    /**
     * This module is imported
     * for commons good
     */
    import * as lodash from "lodash";`,
    output: `/**
    * This module is imported
    * for commons good
    */
   import * as lodash from "lodash";

   import {relative} from "../../relative-package";`
  },
  {
    input: `// This module is imported for commons good
    // This module is imported for commons good
    // This module is imported for commons good
    import {relative} from "../../relative-package";
    import * as lodash from "lodash";`,
    output: `import * as lodash from "lodash";

    // This module is imported for commons good
    // This module is imported for commons good
    // This module is imported for commons good
    import {relative} from "../../relative-package";`
  },
  {
    input: `import _ from 'lodash';

    import fs from 'fs';

    import path from 'path';

    if(true) {
      const dynamic = import("my-dynamic-import");
      const dynamic2 = import("my-dynamic-import2");
    }`,
    output: `import fs from 'fs';
    import _ from 'lodash';
    import path from 'path';

    if(true) {
      const dynamic = import("my-dynamic-import");
      const dynamic2 = import("my-dynamic-import2");
    }`
  },
];
