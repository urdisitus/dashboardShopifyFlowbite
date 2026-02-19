import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'angular-web-storage';
import { SearchProductParams } from '../../models/security/administration/params/SearchProductParams';
import { SearchProductResult } from '../../models/security/administration/SearchProductResult';
import { BaseService } from '../base.service';
import { List } from 'linqts';
import { State } from '../generic/StateEnum';
import { ICrudService } from '../generic/ICrudService';
import { IdNameEntity } from 'src/app/models/generic/Impl/IdNameEntity';
import { ExecutingService } from '../shared/executing.service';

export class Person extends IdNameEntity<string> {
  phone: string;
  email: string;
  birthdate: Date;
  count: number;
  decimal: number;
  profiles: string[];
  persons: string[];

  constructor() {
    super();
    this.birthdate = new Date(1990, 1, 1, 0, 0, 0, 0);
    this.profiles = [];
    this.persons = [];
  }
}

@Injectable()
export class RestApiService extends BaseService implements
  ICrudService<string, Person>{

  private PersonsKey: string = 'KeyPersons';

  constructor(
    public http: HttpClient,
    public local: LocalStorageService,
    public session: SessionStorageService,
    public executingService: ExecutingService) {
    super(http, executingService);
  }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWIwZjU3MTFhM2YwNWMxOGUzYzNlYWYzNTIzMjEwZmE1NDUwZjUzYjoyYWRmOTY5MjFmYmU3ODQ4ZDlkZmNhYWRjZDJmMjIxOGQ2YWJkMzQy'
    })
  }

  // HttpClient API post() method => Create employee
  searchProducts(param: SearchProductParams): Promise<SearchProductResult> {
    return this.postAsJson<SearchProductResult>({
      method: "/api/v1/mobile/catalog/product/search",
      param: param
    });
  }

  searchEnables(param: any): Promise<Person[]> {
    return this.search(param).then((entities: Person[]) => {
      return new List<Person>(entities).Where(x =>
        x.state == State.Enabled).ToArray();
    });
  }

  search(param: any): Promise<Person[]> {
    let entities: Person[] = this.local.get(this.PersonsKey);
    if (entities == null) {
      entities = [];
    }
    let list: List<Person> = new List<Person>(entities);
    return new Promise<Person[]>(resolve => {
      resolve(list.Where(x =>
        ((param
          && param.state
          && x.state == param.state)
          || ((!param
            || !param.state)
            && x.state != State.Deleted))
        && (!param
          || !param.criteria
          || this.contains(x.name, param.criteria)
          || this.contains(x.email, param.criteria)
          || x.phone == param.criteria
          || x.id == param.criteria)
        && (!param
          || !param.profiles
          || param.profiles.length == 0
          || this.containsArray(x.profiles, param.profiles))).ToArray());
    });
  }

  contains(source, criteria) {
    return source.indexOf(criteria) > -1;
  }

  containsArray(source: any[], criteria: any[]) {
    for (let index = 0; index < criteria.length; index++) {
      const element = criteria[index];
      if (source.indexOf(element) == -1) {
        return false;
      }
    }
    return true;
  }

  listAll(): Promise<Person[]> {
    let entities: Person[] = this.local.get(this.PersonsKey);
    if (entities == null) {
      entities = [];
    }
    let list: List<Person> = new List<Person>(entities);
    return new Promise<Person[]>(resolve => {
      resolve(list.Where(x => x.state != State.Deleted).ToArray());
    });
  }

  getByKey(id: string): Promise<Person> {
    let entities: Person[] = this.local.get(this.PersonsKey);
    if (entities == null) {
      entities = [];
    }
    let list: List<Person> = new List<Person>(entities);
    return new Promise<Person>(resolve => {
      resolve(list.Where(x => x.id == id).FirstOrDefault());
    });
  }

  store(param: Person): Promise<Person> {
    let entities: Person[] = this.local.get(this.PersonsKey);
    if (entities == null) {
      entities = [];
    }
    let list: List<Person> = new List<Person>(entities);
    let existing = list.Where(x => x.id == param.id).FirstOrDefault();
    if (existing != null) {
      existing.birthdate = param.birthdate;
      existing.count = param.count;
      existing.decimal = param.decimal;
      existing.email = param.email;
      existing.name = param.name;
      existing.phone = param.phone;
      existing.state = param.state;
      existing.profiles = param.profiles;
      existing.persons = param.persons;
    } else {
      param.id = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase();
      existing = param;
      entities.push(existing);
    }
    this.local.set(this.PersonsKey, entities);
    return new Promise<Person>(resolve => {
      resolve(existing);
    });
  }

  enable(id: string): Promise<Person> {
    return this.getByKey(id).then(entity => {
      entity.state = State.Enabled;
      return this.store(entity);
    });
  }

  disable(id: string): Promise<Person> {
    return this.getByKey(id).then((entity: Person) => {
      entity.state = State.Disabled;
      return this.store(entity);
    });
  }

  delete(id: string): Promise<Person> {
    return this.getByKey(id).then((entity: Person) => {
      entity.state = State.Deleted;
      return this.store(entity);
    });
  }
}
