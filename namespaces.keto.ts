import {Context, Namespace} from "@ory/keto-namespace-types";

class User implements Namespace {
}

class Role implements Namespace {
  related: {
    members: (User | Role)[];
  };

  permits = {
    isMember: (ctx: Context): boolean =>
      this.related.members.includes(ctx.subject), // ||
      // this.related.members.traverse((m) => m.permits.isMember(ctx)),
  }
}

class PointOfSales implements Namespace {
  related: {
    store: Store[];
    employees: Role[];
  };

  permits = {
    login: (ctx: Context): boolean =>
      this.related.employees.traverse((r) => r.permits.isMember(ctx)) ||
      this.related.store.traverse((s) => s.permits.login(ctx)),
  };
}

class Store implements Namespace {
  related: {
    Account: Account[];
    managers: Role[];
  };

  permits = {
    login: (ctx: Context): boolean =>
      this.related.managers.includes(ctx.subject) ||
      this.related.Account.traverse((a) => a.permits.login(ctx)),

    manageStock: (ctx: Context): boolean =>
      this.related.managers.includes(ctx.subject) ||
      this.related.Account.traverse((a) => a.permits.manageStock(ctx)),
  };
}

class Account implements Namespace {
  related: {
    orgs: Organization[];
    admins: Role[];
  };

  permits = {
    login: (ctx: Context): boolean =>
      this.related.admins.includes(ctx.subject) ||
      this.related.orgs.traverse((a) => a.permits.login(ctx)),

    manageStock: (ctx: Context): boolean =>
      this.related.admins.includes(ctx.subject) ||
      this.related.orgs.traverse((o) => o.permits.manageStock(ctx)),
  };
}

class Organization implements Namespace {
  related: {
    execs: Role[];
  };

  permits = {
    login: (ctx: Context): boolean => this.related.execs.includes(ctx.subject),

    manageStock: (ctx: Context): boolean =>
      this.related.execs.includes(ctx.subject),
  };
}
