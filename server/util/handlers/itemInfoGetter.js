/**
 * itemInfoGetter.js
 * Written by Michael Albinson 3/27/17
 *
 * Used to get information about items, as this is a common task among both the handler and action files
 */

"use strict";

var lit = require('./../Literals');

/**
 * Gets info for a item provided that the vote, item type and list to append the item is provided. Commonly utilized
 * with some form of recursiveGet. The list to push to must be a mutable array that is the first element of another mutable array.
 * i.e. [[this, would, be, your, list]] (this operated based on the premise of recursiveGet, for more information, see recursion.js)
 *
 * @param item
 * @param vote
 * @param type
 * @param list
 */
exports.generalInfo = function(item, vote, type, list) {
    var hasVoted = vote ? (vote.getValue(lit.FIELD_VOTE_VALUE) ? "positive" : "negative") : undefined; // true if there is a vote, false if there is no vote
    var voteValue;
    if (type == 'post' || type == 'link')
        voteValue = vote ? vote.getValue(lit.FIELD_VOTE_VALUE) : 0;

    var data;
    switch(type) { //TODO: still need isSubscribed and isSaved information about each row
        case('post'):
            data = exports.getQuestionInfo(item, voteValue, hasVoted);
            break;
        case('link'):
            data = exports.getLinkInfo(item, voteValue, hasVoted);
            break;
        case('class'):
            data = exports.getClassInfo(item, voteValue, hasVoted);
            break;
        case('comment'):
            data = exports.getCommentInfo(item, voteValue, hasVoted);
            break;
        case('rating'):
            data = exports.getRatingInfo(item, voteValue, hasVoted);
            break;
        default:
            break;
    }
    list[0].push(data);
};

/**
 * Gets the info for the provided question. The vote information should be provided along with the question DBRow.
 *
 * @param item the question DBRow
 * @param voteValue the value of the vote associated with the question
 * @param hasVoted whether or not the user has voted, which is given as the "polarity" of the vote, either positive or negative
 * @returns {{id, title, votes, author, date, summary, type: string, tags, voted: *, voteValue: *}}
 */
exports.getQuestionInfo = function(item, voteValue, hasVoted) {
    return {
        id: item.getValue(lit.FIELD_ID),
        title: item.getValue(lit.FIELD_TITLE),
        votes: item.getValue(lit.FIELD_NETVOTES),
        author: item.getValue(lit.FIELD_AUTHOR),
        date: item.getValue(lit.FIELD_TIMESTAMP),
        summary: item.getValue(lit.FIELD_CONTENT),
        type: lit.POST_TABLE,
        tags: item.getValue(lit.FIELD_TAGS),
        voted: hasVoted,
        voteValue: voteValue
    };
};

/**
 * Gets the row info for the given link
 *
 * @param item the link DBRow
 * @param voteValue the value of the vote associated with the link
 * @param hasVoted whether or not the user has voted, which is given as the "polarity" of the vote, either positive or negative
 * @returns {{id, title, votes, author, date, summary, type: string, tags, url, voted: *, voteValue: *}}
 */
exports.getLinkInfo = function(item, voteValue, hasVoted) {
    return {
        id: item.getValue(lit.FIELD_ID),
        title: item.getValue(lit.FIELD_TITLE),
        votes: item.getValue(lit.FIELD_NETVOTES),
        author: item.getValue(lit.FIELD_ADDED_BY),
        date: item.getValue('datetime'),
        summary: item.getValue(lit.FIELD_SUMMARY),
        type: lit.LINK_TABLE,
        tags: item.getValue(lit.FIELD_TAGS),
        url: item.getValue(lit.FIELD_LINK),
        voted: hasVoted,
        voteValue: voteValue
    };
};

/**
 * Gets the row info for the given class
 *
 * @param item the class DBRow
 * @param voteValue the value of the vote associated with the class
 * @param hasVoted whether or not the user has voted, which is given as the "polarity" of the vote, either positive or negative
 * @returns {{id, title, courseCode, rating, author, summary, type: string, tags, voted: *}}
 */
exports.getClassInfo = function(item, voteValue, hasVoted) {
    return {
        id: item.getValue(lit.FIELD_ID),
        title: item.getValue(lit.FIELD_TITLE),
        courseCode: item.getValue(lit.FIELD_COURSE_CODE),
        rating: item.getValue(lit.FIELD_AVERAGE_RATING),
        author: item.getValue(lit.FIELD_ADDED_BY),
        summary: item.getValue(lit.FIELD_SUMMARY),
        type: lit.CLASS_TABLE,
        tags: item.getValue(lit.FIELD_TAGS),
        voted: hasVoted
    };
};

/**
 * Gets the row info for the given comment
 *
 * @param item the comment DBRow
 * @param voteValue the value of the vote associated with the comment
 * @param hasVoted whether or not the user has voted, which is given as the "polarity" of the vote, either positive or negative
 * @returns {{id, author, content, netVotes, parent, parentComment, type: string, date, voted: *}}
 */
exports.getCommentInfo = function(item, voteValue, hasVoted) {
    return {
        id: item.getValue(lit.FIELD_ID),
        author: item.getValue(lit.FIELD_AUTHOR),
        content: item.getValue(lit.FIELD_CONTENT),
        netVotes: item.getValue(lit.FIELD_NETVOTES),
        parent: item.getValue(lit.FIELD_PARENT_POST),
        parentComment: item.getValue(lit.FIELD_PARENT_COMMENT),
        type: lit.COMMENT_TABLE,
        date: item.getValue(lit.FIELD_TIMESTAMP),
        voted: hasVoted
    };
};

/**
 * Gets the row info for the given rating
 *
 * @param item the rating DBRow
 * @param voteValue the value of the vote associated with the rating
 * @param hasVoted whether or not the user has voted, which is given as the "polarity" of the vote, either positive or negative
 * @returns {{parent, id, rating, author, content, date, type: string, voted: *}}
 */
exports.getRatingInfo = function(item, voteValue, hasVoted) {
    return {
        parent: item.getValue(lit.FIELD_PARENT),
        id: item.getValue(lit.FIELD_ID),
        rating: item.getValue(lit.FIELD_AVERAGE_RATING),
        author: item.getValue(lit.FIELD_AUTHOR),
        content: item.getValue(lit.FIELD_CONTENT),
        date: item.getValue('datetime'),
        type: lit.RATING_TABLE,
        voted: hasVoted
    };
};