const express = require('express');
const app = express();
const port = 2507;

app.use(express.json());
// Khai báo mảng users ở phạm vi toàn cục
let users = [
    { id: 1, name: "hoanq" },
    { id: 2, name: "hoanqq" }
];

// Endpoint GET
app.get('/users', (req, res) => {
    res.json(users);
});

// Endpoint POST
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json({ message: 'Người dùng mới đã được tạo', user: newUser });
});

// Endpoint PUT
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
    res.json({ message: `Người dùng có ID ${userId} đã được cập nhật`, updatedData });
});

// Endpoint DELETE
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Người dùng có ID ${userId} đã bị xóa` });
});

// Khởi động server
app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
});
