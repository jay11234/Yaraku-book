import axios from "axios";
import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import "../../../public/css/custom.css";
import { ExportReactCSV } from "./ExportReactCSV";
import {
    Button,
    Table,
    Container,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormGroup,
    Label,
    Input,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//this configures notification
toast.configure();

const notifyYear = () => {
    toast.info("Follow the year format; ex 2020", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
    });
};
const notifyBookModel = () => {
    toast.info("You need to fill all the required information", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
    });
};
const notifyAuthorName = () => {
    toast.info("You must type firstname, space and last name ", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
    });
};
const notifyAuthorModel = () => {
    toast.info("First name and last name are required", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
    });
};

class BookList extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            filteredBooks: [],
            authors: [],
            newBookData: {
                title: "",
                year: "",
                author_id: "",
                genre: ""
            },
            newAuthorData: {
                first_name: "",
                last_name: ""
            },
            newBookModal: false,
            newAuthorModal: false,
            editAuthorModal: false,
            editAuthorData: {
                id: "",
                first_name: "",
                last_name: ""
            },
            filter: "",
            prev: []
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ isFetching: true });

        axios.get("/api/v1/authors").then(response => {
            this.setState({
                authors: response.data
            });
            axios.get("/api/v1/books").then(response => {
                this.setState({
                    books: response.data
                });
            });
        });
    }

    // Book Crud operations

    deleteBook(id) {
        axios.delete("api/v1/books/" + id).then(response => {
            this._refreshBookList();
        });
    }
    _refreshBookList() {
        axios.get("api/v1/books").then(response => {
            this.setState({
                books: response.data
            });
        });
    }
    _refreshAuthorList() {
        axios.get("api/v1/authors").then(response => {
            this.setState({
                authors: response.data
            });
        });
    }

    addBook() {
        if (
            this.state.newBookData.title.length == 0 ||
            this.state.newBookData.genre.length == 0
        ) {
            notifyBookModel();
            return;
        }
        if (this.state.newBookData.year.length < 4) {
            notifyYear();
            return;
        }
        if (this.state.newBookData.year) {
            axios
                .post("/api/v1/books", this.state.newBookData)
                .then(response => {
                    // let { books } = this.state;
                    // books.push(response.data);
                    this._refreshBookList();
                    this.setState({
                        newBookData: {
                            title: "",
                            year: "",
                            author_id: "",
                            genre: ""
                        },
                        newBookModal: false
                    });
                })
                .then(error => {
                    console.log(error);
                });
        }
    }

    // Author Crud Operations
    getAuthorName(author_id) {
        var author = this.state.authors.find(item => item.id === author_id);

        if (typeof author !== undefined && author !== null) {
            return author.first_name + " " + author.last_name;
        } else {
            return "";
        }
    }
    editAuthor(author_id) {
        var object = this.state.authors.filter(x => {
            return x.id == author_id;
        });
        var first_name = object[0].first_name;
        var last_name = object[0].last_name;
        let { editAuthorData } = this.state;
        editAuthorData.id = author_id;
        editAuthorData.first_name = first_name;
        editAuthorData.last_name = last_name;

        this.setState({
            editAuthorData,
            editAuthorModal: !this.state.editAuthorModal
        });
    }
    updateAuthor() {
        let { first_name, last_name } = this.state.editAuthorData;
        axios
            .put("api/v1/authors/" + this.state.editAuthorData.id, {
                first_name,
                last_name
            })
            .then(response => {
                this.setState({
                    editAuthorModal: false
                });
                this._refreshAuthorList();
                this._refreshBookList();
            });
    }

    addAuthor() {
        if (
            this.state.newAuthorData.first_name.length == 0 ||
            this.state.newAuthorData.last_name.length == 0
        ) {
            notifyAuthorModel();
            return;
        }
        axios
            .post("/api/v1/authors", this.state.newAuthorData)
            .then(response => {
                let { authors } = this.state;
                authors.push(response.data);
                this.setState({
                    authors,
                    newAuthorModal: false
                });
            })
            .then(error => {
                console.log(error);
            });
    }

    // Toggle
    toggleNewBookModal() {
        this.setState({
            newBookModal: !this.state.newBookModal
        });
    }
    toggleNewAuthorModal() {
        this.setState({
            newAuthorModal: !this.state.newAuthorModal
        });
    }
    toggleEditAuthorModal() {
        this.setState({
            editAuthorModal: !this.state.editAuthorModal
        });
    }

    // sort by title

    handleSort(event) {
        let id = event.target.id;

        this.setState(prev => {
            return {
                [id]: !prev[id],
                books: prev.books.sort((a, b) => {
                    if (prev[id]) {
                        if (a[id] < b[id]) return 1;
                        else if (a[id] > b[id]) return -1;
                        return 0;
                    } else {
                        if (a[id] < b[id]) return -1;
                        else if (a[id] > b[id]) return 1;
                        return 0;
                    }
                    // prev[id] ? a[id] < b[id] : a[id] > b[id]
                })
            };
        });
    }

    //search
    handleChange(event) {
        this.setState({
            filter: event.target.value
        });
    }

    render() {
        const lowerCaseFilter = this.state.filter.toLowerCase();
        const filteredBooks = this.state.books.filter(item => {
            return Object.keys(item).some(
                key =>
                    typeof item[key] === "string" &&
                    item[key].toLowerCase().includes(lowerCaseFilter)
            );
        });

        let books = filteredBooks.map((book, index) => {
            return (
                <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{this.getAuthorName(book.author_id)}</td>
                    <td>{book.year}</td>
                    <td>{book.genre}</td>
                    <td>
                        <Button
                            color="danger"
                            onClick={this.deleteBook.bind(this, book.id)}
                        >
                            Delete
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            color="secondary"
                            onClick={this.editAuthor.bind(this, book.author_id)}
                        >
                            Change Author Name
                        </Button>
                    </td>
                </tr>
            );
        });

        let selectAuthorOptions = this.state.authors.map((author, index) => {
            return (
                <option key={author.id} value={author.id}>
                    {this.getAuthorName(author.id)}
                </option>
            );
        });

        selectAuthorOptions = [
            <option key="0">Select an author ...</option>
        ].concat(selectAuthorOptions);

        let selectAuthor = (
            <select
                onChange={e => {
                    let { newBookData } = this.state;
                    newBookData.author_id = e.target.value;
                    this.setState({ newBookData });
                }}
                className="form-control"
            >
                {selectAuthorOptions}
            </select>
        );
        return (
            <div className="App Container" style={{ marginTop: 30 }}>
                <Container className="themed-container" fluid="sm">
                    <Col sm="12" md={{ size: 12 }}>
                        <InputGroup mb={4} style={{ marginBottom: 10 }}>
                            <Col sm={6}>
                                <Button
                                    color="primary"
                                    onClick={this.toggleNewBookModal.bind(this)}
                                >
                                    Create a New Book
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    color="info"
                                    onClick={this.toggleNewAuthorModal.bind(
                                        this
                                    )}
                                >
                                    Create a New Author
                                </Button>
                                <ExportReactCSV
                                    csvData={this.state.books}
                                    fileName={this.state.fileName}
                                />
                            </Col>
                            <Col sm={6}>
                                <Input
                                    value={this.state.filter}
                                    onChange={this.handleChange.bind(this)}
                                    className="float-right"
                                    type="text"
                                    name="searchText"
                                    id="searchText"
                                    placeholder="Search by title ..."
                                />
                            </Col>
                        </InputGroup>
                        <div>
                            <Modal
                                isOpen={this.state.newBookModal}
                                toggle={this.toggleNewBookModal.bind(this)}
                            >
                                <ModalHeader
                                    toggle={this.toggleNewBookModal.bind(this)}
                                >
                                    Create a new book
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="title">Title</Label>
                                        <Input
                                            required
                                            value={this.state.newBookData.title}
                                            onChange={e => {
                                                let {
                                                    newBookData
                                                } = this.state;
                                                newBookData.title =
                                                    e.target.value;
                                                this.setState({ newBookData });
                                            }}
                                            type="text"
                                            name="title"
                                            id="title"
                                            placeholder="Title ..."
                                        />
                                    </FormGroup>
                                    {selectAuthor}
                                    <FormGroup>
                                        <Label for="year">Year</Label>
                                        <Input
                                            required
                                            value={this.state.newBookData.year}
                                            onChange={e => {
                                                let {
                                                    newBookData
                                                } = this.state;
                                                newBookData.year =
                                                    e.target.value;
                                                this.setState({ newBookData });
                                            }}
                                            type="text"
                                            name="year"
                                            id="year"
                                            placeholder="Year ..."
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="genre">Genre</Label>
                                        <Input
                                            required
                                            value={this.state.newBookData.genre}
                                            onChange={e => {
                                                let {
                                                    newBookData
                                                } = this.state;
                                                newBookData.genre =
                                                    e.target.value;
                                                this.setState({ newBookData });
                                            }}
                                            type="text"
                                            name="genre"
                                            id="genre"
                                            placeholder="Genre ..."
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        onClick={this.addBook.bind(this)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggleNewBookModal.bind(
                                            this
                                        )}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                        <div>
                            <Modal
                                isOpen={this.state.newAuthorModal}
                                toggle={this.toggleNewAuthorModal.bind(this)}
                            >
                                <ModalHeader
                                    toggle={this.toggleNewAuthorModal.bind(
                                        this
                                    )}
                                >
                                    Create a new book
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="first_name">
                                            First Name
                                        </Label>
                                        <Input
                                            required
                                            value={
                                                this.state.newAuthorModal
                                                    .first_name
                                            }
                                            onChange={e => {
                                                let {
                                                    newAuthorData
                                                } = this.state;
                                                newAuthorData.first_name =
                                                    e.target.value;
                                                this.setState({
                                                    newAuthorData
                                                });
                                            }}
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            placeholder="First name ..."
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="last_name">Last Name</Label>
                                        <Input
                                            required
                                            value={
                                                this.state.newAuthorModal
                                                    .last_name
                                            }
                                            onChange={e => {
                                                let {
                                                    newAuthorData
                                                } = this.state;
                                                newAuthorData.last_name =
                                                    e.target.value;
                                                this.setState({
                                                    newAuthorData
                                                });
                                            }}
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            placeholder="Last name ..."
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        onClick={this.addAuthor.bind(this)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggleNewAuthorModal.bind(
                                            this
                                        )}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* edit book modal */}
                            <Modal
                                isOpen={this.state.editAuthorModal}
                                toggle={this.toggleEditAuthorModal.bind(this)}
                            >
                                <ModalHeader
                                    toggle={this.toggleEditAuthorModal.bind(
                                        this
                                    )}
                                >
                                    Update Author Information
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="first_name">
                                            First Name
                                        </Label>
                                        <Input
                                            required
                                            value={
                                                this.state.editAuthorData
                                                    .first_name
                                            }
                                            onChange={e => {
                                                let {
                                                    editAuthorData
                                                } = this.state;
                                                editAuthorData.first_name =
                                                    e.target.value;
                                                this.setState({
                                                    editAuthorData
                                                });
                                            }}
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            placeholder="First name ..."
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="last_name">Last Name</Label>
                                        <Input
                                            required
                                            value={
                                                this.state.editAuthorData
                                                    .last_name
                                            }
                                            onChange={e => {
                                                let {
                                                    editAuthorData
                                                } = this.state;
                                                editAuthorData.last_name =
                                                    e.target.value;
                                                this.setState({
                                                    editAuthorData
                                                });
                                            }}
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            placeholder="Last name ..."
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        onClick={this.updateAuthor.bind(this)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggleEditAuthorModal.bind(
                                            this
                                        )}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </Col>

                    {/* --------------------table starts here -----------------*/}
                    <Col sm="12" md={{ size: 10, offset: 1 }}>
                        <Table responsive id="dataTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th
                                        value="title"
                                        id="title"
                                        onClick={this.handleSort.bind(this)}
                                    >
                                        Title
                                    </th>
                                    <th>Author</th>
                                    <th>Year</th>
                                    <th>Genre</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>{books}</tbody>
                        </Table>
                    </Col>
                </Container>
            </div>
        );
    }
}

export default BookList;
