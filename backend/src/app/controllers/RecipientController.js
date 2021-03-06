import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page = 1, limit = 20, q = '' } = req.query;

    const recipients = await Recipient.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      },
      offset: (page - 1) * limit,
      limit,
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'state',
        'city',
        'zipcode',
        'complement',
      ],
    });

    return res.format({ ...recipients, page, limit });
  }

  async store(req, res) {
    const {
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
      complement,
    } = await Recipient.create(req.body);

    return res.format({
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
      complement,
    });
  }

  async update(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.format(
        { type: 'notfound', errors: ['Recipient not found'] },
        404
      );
    }

    const {
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
      complement,
    } = await recipient.update(req.body);

    return res.format({
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
      complement,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.format(
        { type: 'notfound', errors: ['Recipient not found'] },
        404
      );
    }

    await recipient.destroy();

    return res.format(`Recipient ${recipient.name} successfull deleted`);
  }
}

export default new RecipientController();
