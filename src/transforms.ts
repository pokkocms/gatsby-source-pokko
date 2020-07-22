const { GraphQLObjectType, GraphQLNonNull } = require(`gatsby/graphql`);
const {
  mapSchema,
  MapperKind,
  addTypes,
  modifyObjectFields,
} = require(`@graphql-tools/utils`);

export class NamespaceUnderFieldTransform {
  typeName: string;
  fieldName: string;
  resolver: any;

  constructor({ typeName, fieldName, resolver }: any) {
    this.typeName = typeName;
    this.fieldName = fieldName;
    this.resolver = resolver;
  }

  transformSchema(schema: any) {
    const queryConfig = schema.getQueryType().toConfig();

    const nestedQuery = new GraphQLObjectType({
      ...queryConfig,
      name: this.typeName,
    });

    let newSchema = addTypes(schema, [nestedQuery]);

    const newRootFieldConfigMap = {
      [this.fieldName]: {
        type: new GraphQLNonNull(nestedQuery),
        resolve: (parent: any, args: any, context: any, info: any) => {
          if (this.resolver != null) {
            return this.resolver(parent, args, context, info);
          }

          return {};
        },
      },
    };

    [newSchema] = modifyObjectFields(
      newSchema,
      queryConfig.name,
      () => true,
      newRootFieldConfigMap
    );

    return newSchema;
  }
}

export class StripNonQueryTransform {
  transformSchema(schema: any) {
    return mapSchema(schema, {
      [MapperKind.MUTATION]() {
        return null;
      },
      [MapperKind.SUBSCRIPTION]() {
        return null;
      },
    });
  }
}
