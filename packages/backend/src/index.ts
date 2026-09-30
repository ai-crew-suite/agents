/*
 * Copyright 2026 The AI Crew Suite Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createBackend } from '@backstage/backend-defaults';

import appPlugin from '@backstage/plugin-app-backend';
import proxyPlugin from '@backstage/plugin-proxy-backend';
import scaffolderPlugin from '@backstage/plugin-scaffolder-backend';
import scaffolderModuleGithub from '@backstage/plugin-scaffolder-backend-module-github';
import scaffolderModuleNotifications from '@backstage/plugin-scaffolder-backend-module-notifications';
import techdocsPlugin from '@backstage/plugin-techdocs-backend';
import authPlugin from '@backstage/plugin-auth-backend';
import authModuleGuestProvider from '@backstage/plugin-auth-backend-module-guest-provider';
import catalogPlugin from '@backstage/plugin-catalog-backend';
import catalogModuleScaffolderEntityModel from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import catalogModuleLogs from '@backstage/plugin-catalog-backend-module-logs';
import permissionPlugin from '@backstage/plugin-permission-backend';
import permissionModuleAllowAll from '@backstage/plugin-permission-backend-module-allow-all-policy';
import searchPlugin from '@backstage/plugin-search-backend';
import searchModulePg from '@backstage/plugin-search-backend-module-pg';
import searchModuleCatalog from '@backstage/plugin-search-backend-module-catalog';
import searchModuleTechdocs from '@backstage/plugin-search-backend-module-techdocs';
import kubernetesPlugin from '@backstage/plugin-kubernetes-backend';
import notificationsPlugin from '@backstage/plugin-notifications-backend';
import signalsPlugin from '@backstage/plugin-signals-backend';
import mcpActionsPlugin from '@backstage/plugin-mcp-actions-backend';

// Local packages
import agentCatalogInsights from '@ai-crew-suite/plugin-platform-backend-module-agent-catalog-insights';
import agentOncallHandover from '@ai-crew-suite/plugin-platform-backend-module-agent-oncall-handover';
import agentReleaseNotesGenerator from '@ai-crew-suite/plugin-platform-backend-module-agent-release-notes-generator';
import agentRfcAdrReviewer from '@ai-crew-suite/plugin-platform-backend-module-agent-rfc-adr-reviewer';
import agentAlertTuner from '@ai-crew-suite/agent-alert-tuner';
import agentScaffolderDriftDetector from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-drift-detector';
import agentScaffolderGuardrail from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-guardrail';
import agentScaffolderInfra from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-infra';
import agentScaffolderIntent from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-intent';
import agentScaffolderShadowDetective from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-shadow-detective';
import agentScaffolderPrd from '@ai-crew-suite/plugin-platform-backend-module-agent-scaffolder-prd';
import agentSearchArcheology from '@ai-crew-suite/plugin-platform-backend-module-agent-search-archeology';
import agentSearchContext from '@ai-crew-suite/plugin-platform-backend-module-agent-search-context';
import agentTechDebtScout from '@ai-crew-suite/plugin-platform-backend-module-agent-tech-debt-scout';
import agentTechRadarManager from '@ai-crew-suite/plugin-platform-backend-module-agent-tech-radar-manager';
import agentTechdocsJanitor from '@ai-crew-suite/plugin-platform-backend-module-agent-techdocs-janitor';
import agentTechdocsPostmortem from '@ai-crew-suite/plugin-platform-backend-module-agent-techdocs-postmortem';

const backend = createBackend();

/**
 * Serves the compiled frontend single-page application (SPA)
 * bundles directly from your backend instance.
 */
backend.add(appPlugin);

/**
 * Provides an authenticated routing proxy that safely forwards
 * frontend network requests to external APIs, preventing CORS issues
 * and masking sensitive backend credentials.
 */
backend.add(proxyPlugin);

/**
 * The core Scaffolder plugin engine. Enables software templates,
 * task orchestration, and automated skeletal generation workflows.
 */
backend.add(scaffolderPlugin);

/**
 * Extends the Scaffolder plugin by registering provider-specific actions
 * for GitHub (e.g., publishing repositories, creating pull requests).
 */
backend.add(scaffolderModuleGithub);

/**
 * Extends the Scaffolder engine to allow running template tasks to trigger
 * system notifications or dispatch status updates upon lifecycle milestones.
 */
backend.add(scaffolderModuleNotifications);

/**
 * The core TechDocs engine. Responsible for fetching markdown files from
 * your source repositories, rendering HTML files, and serving them.
 */
backend.add(techdocsPlugin);

/**
 * The core Authentication and Identity manager plugin. Orchestrates
 * user sessions, signs profile structures, and coordinates providers.
 * @see {@link https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin}
 */
backend.add(authPlugin);

/**
 * Registers the mock Guest auth provider. Generates actual session tokens inside
 * local development environments to accommodate permission-dependent plugins.
 * @caution Strictly intended for local development environments; automatically
 * blocked in production.
 * @see {@link https://backstage.io/docs/auth/guest/provider}
 */
backend.add(authModuleGuestProvider);

/**
 * The foundational Backstage Software Catalog engine. Collects, tracks,
 * updates, and structures ownership dependencies among metadata entities.
 */
backend.add(catalogPlugin);

/**
 * Registers the template definition parser logic within the Catalog. Essential if
 * you want the Software Catalog to understand and show "Template" kind entities.
 */
backend.add(catalogModuleScaffolderEntityModel);

/**
 * Subscribes to catalog execution events and automatically streams parsing,
 * ingestion, or validation errors into the system logs at a 'warn' level.
 */
backend.add(catalogModuleLogs);

/**
 * The core authorization plugin. Orchestrates access evaluation queries by checking
 * incoming requests and routing them against a central decision policy.
 */
backend.add(permissionPlugin);

/**
 * Implements a permissive fallback permission policy that implicitly
 * approves every incoming request across your Backstage platform.
 * @caution Typically utilized to validate the setup framework during
 * initial installation;
 * highly discouraged for real production environments.
 * @see {@link https://backstage.io/docs/permissions/getting-started}
 */
backend.add(permissionModuleAllowAll);

/**
 * The platform-wide search platform engine. Coordinates execution query pipelines,
 * maps runtime indices, and routes searches out to specialized index collators.
 */
backend.add(searchPlugin);

/**
 * Overrides the default in-memory search indexing layout with a persistent, scalable
 * relational engine built on top of your existing Postgres database instance.
 * @requirement Requires at least PostgreSQL version 12 to run successfully.
 */
backend.add(searchModulePg);

/**
 * An index compilation routine that continuously pulls software entity metadata
 * directly from your Catalog and streams it into the active Search Engine index.
 */
backend.add(searchModuleCatalog);

/**
 * A documentation compilation routine that extracts generated HTML or markdown technical
 * documents from the TechDocs storage target into the active Search Engine index.
 */
backend.add(searchModuleTechdocs);

/**
 * The core Kubernetes plugin. Connects your catalog components to actual runtime clusters
 * to pull real-time health diagnostics, pod allocations, and deployment statuses.
 */
backend.add(kubernetesPlugin);

/**
 * The central alerting plugin. Dispatches user-facing updates, platform alerts, and
 * operational tasks out to diverse client integration targets (e.g., Email, Slack, UI).
 */
backend.add(notificationsPlugin);

/**
 * Orchestrates persistent real-time event buses (like WebSockets) to broadcast
 * system status events instantly down to active browser sessions.
 */
backend.add(signalsPlugin);

/**
 * Integrates the Model Context Protocol (MCP) into your ecosystem, allowing
 * connected LLM assistants to discover and trigger infrastructure operations safely.
 */
backend.add(mcpActionsPlugin);

// agent workflow modules (AI Core agents)
backend.add(agentCatalogInsights);
backend.add(agentOncallHandover);
backend.add(agentReleaseNotesGenerator);
backend.add(agentRfcAdrReviewer);
backend.add(agentAlertTuner);
backend.add(agentScaffolderDriftDetector);
backend.add(agentScaffolderGuardrail);
backend.add(agentScaffolderInfra);
backend.add(agentScaffolderIntent);
backend.add(agentScaffolderShadowDetective);
backend.add(agentScaffolderPrd);
backend.add(agentSearchArcheology);
backend.add(agentSearchContext);
backend.add(agentTechDebtScout);
backend.add(agentTechRadarManager);
backend.add(agentTechdocsJanitor);
backend.add(agentTechdocsPostmortem);

backend.start();
