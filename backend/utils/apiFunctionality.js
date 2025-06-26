class APIFunctionality {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i" // case-insensitive search
            }
        } : {};
        this.query = this.query.find({...keyword});
        return this
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Removing fields from query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);
        this.query = this.query.find(queryCopy);
        return this;
    }
}

export default APIFunctionality;
