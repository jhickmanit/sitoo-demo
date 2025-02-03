import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types";

class Users implements Namespace {}

class Roles implements Namespace {
  related: {
    members: (Users | Roles)[];
  };
}

class PointOfSales implements Namespace {
  related: {
    store: Stores[];
    employees: Roles[];
  };

  permits = {
    login: (ctx: Context): boolean =>
      this.related.employees.includes(ctx.subject) ||
      this.related.store.traverse((s) => s.permits.login(ctx)),
  };
}

class Stores implements Namespace {
  related: {
    accounts: Accounts[];
    managers: Roles[];
  };

  permits = {
    login: (ctx: Context): boolean =>
      this.related.managers.includes(ctx.subject) ||
      this.related.accounts.traverse((a) => a.permits.login(ctx)),

    manageStock: (ctx: Context): boolean =>
      this.related.managers.includes(ctx.subject) ||
      this.related.accounts.traverse((a) => a.permits.manageStock(ctx)),
  };
}

class Accounts implements Namespace {
  related: {
    orgs: Organizations[];
    admins: Roles[];
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

class Organizations implements Namespace {
  related: {
    execs: Roles[];
  };

  permits = {
    login: (ctx: Context): boolean => this.related.execs.includes(ctx.subject),

    manageStock: (ctx: Context): boolean =>
      this.related.execs.includes(ctx.subject),
  };
}
