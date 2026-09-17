const validateTask = (req, res, next) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    if (title.trim().length < 3) {
        return res.status(400).json({
            error: "Title must be at least 3 characters"
        });
    }

    next();
};

module.exports = validateTask;