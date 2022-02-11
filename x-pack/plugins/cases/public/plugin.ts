/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from 'src/core/public';
import { CasesUiStart, SetupPlugins, StartPlugins } from './types';
import { KibanaServices } from './common/lib/kibana';
import {
  getCasesLazy,
  getRecentCasesLazy,
  getAllCasesSelectorModalLazy,
  getCreateCaseFlyoutLazy,
  canUseCases,
  getCreateCaseFlyoutLazyNoProvider,
} from './methods';
import { CasesUiConfigType } from '../common/ui/types';
import { getCasesContextLazy } from './methods/get_cases_context';
import { useCasesAddToNewCasesFlyout } from './components/create/flyout/use_cases_add_to_new_case_flyout';

/**
 * @public
 * A plugin for retrieving Cases UI components
 */
export class CasesUiPlugin implements Plugin<void, CasesUiStart, SetupPlugins, StartPlugins> {
  private kibanaVersion: string;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.kibanaVersion = initializerContext.env.packageInfo.version;
  }
  public setup(core: CoreSetup, plugins: SetupPlugins) {}

  public start(core: CoreStart, plugins: StartPlugins): CasesUiStart {
    const config = this.initializerContext.config.get<CasesUiConfigType>();
    KibanaServices.init({ ...core, ...plugins, kibanaVersion: this.kibanaVersion, config });
    return {
      canUseCases: canUseCases(core.application.capabilities),
      getCases: getCasesLazy,
      getCasesContext: getCasesContextLazy,
      getRecentCases: getRecentCasesLazy,
      getCreateCaseFlyout: getCreateCaseFlyoutLazy,
      getAllCasesSelectorModal: getAllCasesSelectorModalLazy,
      getCreateCaseFlyoutNoProvider: getCreateCaseFlyoutLazyNoProvider,
      hooks: {
        getUseCasesAddToNewCasesFlyout: () => useCasesAddToNewCasesFlyout,
      },
    };
  }

  public stop() {}
}
