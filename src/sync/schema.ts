import { allAsync } from "honegumi-sync";

export const listModels = async (db: any) => {
  const models = await allAsync(db, `select * from model`);
  const fields = await allAsync(db, `select * from model_field`);

  return models.map((mod) => ({
    ...mod,
    fields: fields.filter(
      (ent) =>
        ent.model_id === mod.id ||
        (mod.inherits || "").indexOf(ent.model_id) !== -1
    ),
  }));
};
