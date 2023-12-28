import { ObjectId } from 'mongodb'

import { utilService } from '../../services/util.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}

async function query(filterBy = {}) {
    console.log('query  filterBy:', filterBy)
    try {
        const criteria = {};

        if (filterBy.name) {
            criteria.name = { $regex: filterBy.name, $options: 'i' };
        }

        if (filterBy.maxPrice !== '' && filterBy.maxPrice !== null && filterBy.maxPrice !== undefined) {
            criteria.price = { $lte: filterBy.maxPrice };
        }

        // if (filterBy.minPrice !== null) {
        //     criteria.price = { ...criteria.price, $gte: filterBy.minPrice };
        // }

        // if (filterBy.inStock !== 0) {
        //     criteria.inStock = { $gt: 1 };
        // }

        const collection = await dbService.getCollection('toy');
        const toys = await collection.find(criteria).toArray();
        console.log('query  toys:', toys)

        return toys;
    } catch (err) {
        logger.error('cannot find toys', err);
        // throw err;
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        // throw err
    }
}

async function remove(toyId) {
    try {
        if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser._id) return
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        // throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        // throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        // throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        // throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        // throw err
    }
}