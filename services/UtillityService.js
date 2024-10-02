
module.exports = {
    buildCriteria: params => {
        const { where = {} } = params;
        delete params.where;
        where.deleted = false;
        return { params, where };
    },

    formatCurrency: input => {
        return parseInt(input).toLocaleString('en-US', { style: 'decimal' });
    },

    postIntro: (post, no_of_letters = 500) => {
        if (post.length <= no_of_letters) return post;
        const intro = post.substr(0, no_of_letters - 1);
        return intro.substr(0, intro.lastIndexOf(' ')) + '...';
    },

    formatDate: date => new Date(date).toLocaleDateString('fr-CA')
}