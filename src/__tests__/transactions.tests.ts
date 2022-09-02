import { Service } from "../Service";

describe('transactions', () => {
    test('has no duplicated transactions', async () => {
        // should use nock to intercept third party calls
        const service = new Service();
        const spyAccounts = jest
        .spyOn(service, 'getAccounts' as any)
        .mockImplementation(async () => {
            return {account:[{
                "acc_number": "000000001",
                "amount": "3000",
            }]};
        });
        const spyTransactions = jest
        .spyOn(service, 'getTransactions' as any)
        .mockImplementation(async () => {
            return {
                transactions: [
                    {
                        id: 1,
                        "amount": "60",
                        "currency": "EUR",
                        "label": "label 2"
                    },
                    {
                        id: 2,
                        "amount": "32",
                        "currency": "EUR",
                        "label": "label 8"
                    },
                    {
                        id: 3,
                        "amount": "25",
                        "currency": "EUR",
                        "label": "label 1"
                    }

                ]
            }
        });

        const accounts = await service.getAccountsWithTransactions();
        expect(accounts[0].acc_number).toBe('000000001');
    });

    test('has duplicated transactions', async () => {
        // should use nock to intercept third party calls
        const service = new Service();
        const spyAccounts = jest
        .spyOn(service, 'getAccounts' as any)
        .mockImplementation(async () => {
            return {account:[{
                "acc_number": "000000001",
                "amount": "3000",
            }]};
        });
        const spyTransactions = jest
        .spyOn(service, 'getTransactions' as any)
        .mockImplementation(async () => {
            return {
                transactions: [
                    {
                        id: 1,
                        "amount": "60",
                        "currency": "EUR",
                        "label": "label 2"
                    },
                    {
                        id: 1,
                        "amount": "32",
                        "currency": "EUR",
                        "label": "label 8"
                    },
                    {
                        id: 3,
                        "amount": "25",
                        "currency": "EUR",
                        "label": "label 1"
                    }

                ]
            }
        });

        expect(service.getAccountsWithTransactions()).rejects.toThrow();
    });
});
