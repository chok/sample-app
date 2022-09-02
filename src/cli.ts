#!/usr/bin/env node

require('dotenv').config();

import util from 'util';
import { Service } from "./Service";

const service = new Service();
service.getAccountsWithTransactions()
.then((accounts) => console.log(util.inspect(accounts, {depth: 4})))
.catch(console.log);
