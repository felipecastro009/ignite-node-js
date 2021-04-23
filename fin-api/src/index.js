const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// middleware
function virifyIfExistisAccountCpf(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: 'customer not exists' });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        }

        if (operation.type === 'debit') {
            return acc - operation.amount;
        }
    }, 0)

    return balance;
}

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
app.post('/accounts', (request, response) => {
    const { cpf, name } = request.body;

    const customersAlrealdyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customersAlrealdyExists) {
        return response.status(400).json({ error: 'Customer already exists.' })
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

app.get('/statement', virifyIfExistisAccountCpf, (request, response) => {
    const { customer } = request;

    return response.status(200).json(customer.statement);
});

app.post('/deposit', virifyIfExistisAccountCpf, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        date: new Date(),
        type: 'credit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post('/withdraw', virifyIfExistisAccountCpf, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).json({ error: 'Insuficient founds!' });
    }

    const statementOperation = {
        amount,
        date: new Date(),
        type: 'debit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(3333);