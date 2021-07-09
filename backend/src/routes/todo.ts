import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { ITodo } from '../types/todo'
import { TodoRepoImpl } from './../repo/todo-repo'

const TodoRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {

    const todoRepo = TodoRepoImpl.of()

    interface IdParam {
        id: string
    }

    // TODO: Add CRUD endpoints, i.e. get, post, update, delete
    // NOTE: the url should be RESTful
    server.get ('/todos', opts, async (request, reply) => {
        const todos: Array<ITodo> = await todoRepo.getTodos()
        return reply.status(200).send({ todos })
    })
    server.post('/todos',opts,async (request, reply) =>{
        const todoBody: ITodo = request.body as ITodo;
        const todo: ITodo = await todoRepo.addTodo(todoBody)
        return reply.status(201).send({todo})
    })

    server.put<{ Params: IdParam }>('/todos/:id', opts, async (request, reply) => {
        try {
            const id = request.params.id
            const todoBody = request.body as ITodo
            const todo: ITodo | null = await todoRepo.updateTodo(id, todoBody)
            if (todo) {
                return reply.status(200).send({ todo })
            } else {
                return reply.status(404).send({ msg: `Not Found Todo:${id}` })
            }
        } catch (error) {
            console.error(`PUT /todos/${request.params.id} Error: ${error}`)
            return reply.status(500).send(`[Server Error]: ${error}`)
        }
    })

    server.delete<{ Params: IdParam }>('/todos/:id', opts, async (request, reply) => {
        const id = request.params.id
        const todo: ITodo | null = await todoRepo.deleteTodo(id)
        if (todo) {
            return reply.status(204).send()
        } else {
            return reply.status(404).send({ msg: `Not Found Todo:${id}` })
        }
    })


    //server.get('/')

    done()
}

export { TodoRouter }
