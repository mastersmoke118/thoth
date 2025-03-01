import type { Sequelize } from "sequelize";
import type { entitiesAttributes, entitiesCreationAttributes } from "./entities";
import { entities as _entities } from "./entities";
import type { spellsAttributes, spellsCreationAttributes } from "./spells";
import { spells as _spells } from "./spells";
import type { eventsAttributes, eventsCreationAttributes } from "./events";
import { events as _events } from "./events";
import type { deployedSpellsAttributes, deployedSpellsCreationAttributes } from "./deployedSpells";
import { deployedSpells as _deployedSpells } from "./deployedSpells";
import type { documentsAttributes, documentsCreationAttributes } from "./documents";
import { documents as _documents } from "./documents";
import type { documentsStoreAttributes, documentsStoreCreationAttributes } from "./documentstores";
import { documentsStore as _documentsStore } from "./documentstores";
import type { contentObjAttributes, contentObjCreationAttributes } from "./content_objects";
import { contentObj as _contentObj } from "./content_objects";
import type { wikipediaAttributes, wikipediaCreationAttributes } from "./wikipedia";
import { wikipedia as _wikipedia } from "./wikipedia";
export {
  _entities as entities,
  _spells as spells,
  _events as events,
  _deployedSpells as deployedSpells,
  _documents as documents,
  _documentsStore as documentsStore,
  _contentObj as contentObj,
  _wikipedia as wikipedia,
};
export type {
  entitiesAttributes,
  entitiesCreationAttributes,
  spellsAttributes,
  spellsCreationAttributes,
  eventsAttributes,
  eventsCreationAttributes,
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
  documentsAttributes,
  documentsCreationAttributes,
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
  contentObjAttributes,
  contentObjCreationAttributes,
  wikipediaAttributes,
  wikipediaCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const entities = _entities.initModel(sequelize);
  const spells = _spells.initModel(sequelize);
  const events = _events.initModel(sequelize);
  const deployedSpells = _deployedSpells.initModel(sequelize);
  const documentsStore = _documentsStore.initModel(sequelize);
  const documents = _documents.initModel(sequelize);
  const contentObj = _contentObj.initModel(sequelize);
  const wikipedia = _wikipedia.initModel(sequelize);

  return {
    entities: entities,
    spells: spells,
    events: events,
    deployedSpells: deployedSpells,
    contentObj: contentObj,
    documents: documents,
    documentsStore: documentsStore,
    wikipedia: wikipedia,
  };
}
