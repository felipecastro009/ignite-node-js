const express = require('express');

const app = express();

app.use(express.json());

app.get('/courses', (request, response) => {
    return response.json([
        'Course 1',
        'Course 2',
    ]);
});

app.post('/courses', (request, response) => {
    return response.json([
        'Course 1',
        'Course 2',
        'Course 3',
    ]);
});

app.put('/courses/:id', (request, response) => {
    return response.json([
        'Course 6',
        'Course 2',
        'Course 3',
    ]);
});

app.delete('/courses/:id', (request, response) => {
    return response.json([
        'Course 2',
        'Course 3',
    ]);
});

app.listen(3333);