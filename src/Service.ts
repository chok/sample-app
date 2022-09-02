import { CONFIG } from "./config";
import axios, { Axios, AxiosResponse } from 'axios';

export class Service {

    protected config;
    protected token?;

    constructor(config = CONFIG.service) {
        this.config = config;
    }

    protected getBaseUrl() {
        const {endpoint} = this.config;
        return `${endpoint.protocol}://${endpoint.host}:${endpoint.port}`;
    }

    public async getRefreshToken() {
        try {
            const {data} = await axios.post('/login', this.config.login, {
                baseURL: this.getBaseUrl(),
                auth: this.config.auth,
            });

            return data.refresh_token;
        }
        catch (e) {
            console.log(e.toJSON());
        }
    }

    public async getAccessToken(refresh_token: string) {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', refresh_token);
            const {data} = await axios.post('/token', params, {
                baseURL: this.getBaseUrl(),
            });

            return data.access_token;
        }
        catch (e) {
            console.log(e.toJSON());
        }
    }

    public async login() {
        const refresh_token = await this.getRefreshToken();
        return this.getAccessToken(refresh_token);
    }

    public async getToken() {
        if (this.token) {
            return this.token;
        }

        return await this.login();
    }

    public async getAccounts() {
        try {
            const {data} = await axios.get('/accounts', {
                baseURL: this.getBaseUrl(),
                headers: {
                    'Authorization': `Bearer ${await this.getToken()}`
                }
            });

            return data;
        }
        catch (e) {
            console.log(e.toJSON());
        }
    }

    public async getTransactions(account: string) {
        try {
            const {data} = await axios.get(`/accounts/${account}/transactions`, {
                baseURL: this.getBaseUrl(),
                headers: {
                    'Authorization': `Bearer ${await this.getToken()}`
                }
            });

            return data;
        }
        catch (e) {
            console.log(e.toJSON());
        }
    }

    public async getAccountsWithTransactions() {
        const {account: accounts} = await this.getAccounts();
        let allTransactions = [];
        for (let index in accounts) {
            const account = accounts[index];
            delete account.currency;
            const {transactions} = (await this.getTransactions(account.acc_number));
            account.transactions = transactions.map((transaction) => {
                return {
                    label: transaction.label,
                    amount: transaction.amount,
                    currency: transaction.currency
                };
            })

            allTransactions = allTransactions.concat(transactions);

            accounts[index] = account;
        }

        const transactionsIds = allTransactions.map((transaction:{id:string}) => transaction.id);
        const uniqueTransactionIds = Array.from(new Set(transactionsIds));

        if (transactionsIds.length > uniqueTransactionIds.length) {
            throw new Error('Duplicated transactions detected');
        }

        return accounts;
    }
}
