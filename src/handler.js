const { nanoid } = require("nanoid");
const { books } = require("./books");

const APIResponse = (res, status, message, code, data = {}) => {
  return res
    .response({
      status,
      message,
      data,
    })
    .code(code);
};

const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    return APIResponse(
      res,
      "fail",
      "Gagal menambahkan buku. Mohon isi nama buku",
      400
    );
  } else if (readPage > pageCount) {
    return APIResponse(
      res,
      "fail",
      "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      400
    );
  } else {
    const data = {
      id: nanoid(16),
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: readPage === pageCount ? true : false,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    books.push(data);

    let isSuccess = books.filter((book) => book.id === data.id).length > 0;
    if (isSuccess) {
      return APIResponse(res, "success", "Buku berhasil ditambahkan", 201, {
        bookId: data.id,
      });
    }
  }

  return APIResponse(res, "fail", "Catatan gagal ditambahkan", 500);
};

const getAllBooks = (req, res) => {
  let { name, reading, finished } = req.query;
  if (books.length > 0) {
    let temp = books.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
    });
    if (name) {
      let temp = books
        .filter(
          (book) => book.name.toLowerCase().search(name.toLowerCase()) >= 0
        )
        .map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        });
      return APIResponse(res, "success", "", 200, { books: temp });
    } else if (reading) {
      let value = parseInt(reading) ? true : false;
      let temp = books
        .filter((book) => book.reading == value)
        .map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            reading: book.reading,
          };
        });
      return APIResponse(res, "success", "", 200, { books: temp });
    } else if (finished) {
      let value = parseInt(finished) ? true : false;
      let temp = books
        .filter((book) => book.finished == value)
        .map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            finished: book.finished,
          };
        });
      return APIResponse(res, "success", "", 200, { books: temp });
    }
    return APIResponse(res, "success", "", 200, { books: temp });
  }
  return APIResponse(res, "success", "", 200, { books: books });
};

const getDetailBook = (req, res) => {
  const { id } = req.params;

  const checkBook = books.filter((book) => book.id === id);
  if (checkBook.length > 0) {
    return APIResponse(res, "success", "", 200, {
      book: checkBook[0],
    });
  }

  return APIResponse(res, "fail", "Buku tidak ditemukan", 404);
};

const updateBook = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const checkBook = books.filter((book) => book.id === id);
  if (checkBook.length > 0) {
    if (!name) {
      return APIResponse(
        res,
        "fail",
        "Gagal memperbarui buku. Mohon isi nama buku",
        400
      );
    } else if (readPage > pageCount) {
      return APIResponse(
        res,
        "fail",
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        400
      );
    } else {
      const temp = books.filter((book) => book.id !== id);
      let data = checkBook[0];
      data.name = name;
      data.year = year;
      data.author = author;
      data.summary = summary;
      data.publisher = publisher;
      data.pageCount = pageCount;
      data.readPage = readPage;
      data.reading = reading;
      data.finished = readPage === pageCount ? true : false;
      data.updatedAt = new Date().toISOString();
      temp.push(data);
      return APIResponse(res, "success", "Buku berhasil diperbarui", 200);
    }
  }
  return APIResponse(
    res,
    "fail",
    "Gagal memperbarui buku. Id tidak ditemukan",
    404
  );
};

const deleteBook = (req, res) => {
  const { id } = req.params;
  const checkBook = books.filter((book) => book.id === id);
  if (checkBook.length > 0) {
    const temp = books.filter((book) => book.id !== id);
    books.length = 0;
    temp.map((book) => books.push(book));
    return APIResponse(res, "fail", "Buku berhasil dihapus", 200);
  }
  return APIResponse(
    res,
    "fail",
    "Buku gagal dihapus. Id tidak ditemukan",
    404
  );
};

module.exports = {
  addBookHandler,
  getAllBooks,
  getDetailBook,
  updateBook,
  deleteBook,
};
