const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

const Client = require("../models/Client");
const Project = require("../models/Project");

//Typedefs
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: {
      type: GraphQLString,
    },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve: (parent, args) => {
        // console.log(Client.findById(parent.clientid));
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: GraphQLList(ProjectType),
      resolve: (parent, args) => {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => project.deleteOne());
        });
        // Project.deleteMany({ clientId: args.id });
        return Client.findByIdAndRemove(args.id);
      },
    },
    updateClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return Client.findByIdAndUpdate(args.id, {
          $set: {
            name: args.name,
            email: args.email,
            phone: args.phone,
          },
        });
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "NOT STARTED" },
              progress: { value: "IN PROGRESS" },
              completed: { value: "COMPLETED" },
            },
            defaultValue: "NOT_STARTED",
          }),
        },
        clientId: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (parent, args) => {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Project.findByIdAndRemove(args.id);
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: GraphQLNonNull(
            new GraphQLEnumType({
              name: "ProjectStatusUpdate",
              values: {
                new: { value: "NOT STARTED" },
                progress: { value: "IN PROGRESS" },
                completed: { value: "COMPLETED" },
              },
            })
          ),
        },
        clientId: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Project.findByIdAndUpdate(args.id, {
          $set: {
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          },
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
