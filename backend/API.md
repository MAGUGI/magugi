# MAGUGI API — Documentação das Rotas

API REST de um fórum (estilo Reddit), construída com Spring Boot 3 e Spring Data JPA.

## Visão geral

- **Base URL:** `http://localhost:8080`
- **Formato:** JSON (request e response)
- **Identificadores:** todos os recursos usam `UUID`
- **Autenticação:** Spring Security (HTTP Basic). Apenas as rotas listadas como _Públicas_ abaixo são abertas; todas as demais exigem autenticação.
- **Paginação:** endpoints que retornam `Page<T>` aceitam os parâmetros de query padrão do Spring: `page` (índice baseado em 0), `size` e `sort` (ex.: `?page=0&size=20&sort=createdAt,desc`).

### Rotas públicas (sem autenticação)

| Método | Rota     |
|--------|----------|
| POST   | `/users` |
| GET    | `/test`  |

Qualquer outra rota retorna `401 Unauthorized` se a requisição não estiver autenticada. **`GET /users` agora exige autenticação** (antes era público, o que vazava emails e hashes de senha de todos os usuários).

---

## Teste

### `GET /test`
Verifica se a API está no ar.

- **Auth:** pública
- **Resposta:** `200 OK` — texto `"MAGUGI API teste"`

---

## Usuários — `/users`

### `GET /users`
Lista todos os usuários.

- **Auth:** autenticada
- **Resposta:** `200 OK` — `List<Usuario>` (sem `email` nem `passwordHash`, que são write-only)

### `POST /users`
Cria um novo usuário. A senha enviada em `passwordHash` é criptografada com BCrypt antes de persistir.

- **Auth:** pública
- **Body:**

```json
{
  "username": "joao",
  "email": "joao@email.com",
  "passwordHash": "senhaEmTextoPlano"
}
```

- **Resposta:** `200 OK` — `Usuario` criado (com `id`, `createdAt`, `updatedAt`; sem `email`/`passwordHash` na resposta)

> **Notas de segurança:**
> - O campo `passwordHash` recebe a senha em texto plano apenas na criação; o serviço aplica o hash BCrypt. Ele é write-only, então nunca aparece em respostas.
> - `email` também é write-only — aceito no cadastro, mas omitido das respostas (dado pessoal / LGPD).
> - `isAdmin` é **ignorado** se enviado no body: o serviço força `false` na criação, impedindo escalação de privilégio. A promoção a admin deve ser feita por outro fluxo controlado.

---

## Fóruns — `/forums`

Apenas fóruns com `isPrivate = false` e `isQuarantined = false` aparecem na listagem.

### `GET /forums`
Lista fóruns públicos e não-quarentenados (paginado).

- **Resposta:** `200 OK` — `Page<Forum>`

### `GET /forums/{id}`
Busca um fórum por ID.

- **Resposta:** `200 OK` — `Forum` · `500` se não encontrado

### `POST /forums`
Cria um fórum.

- **Body:**

```json
{
  "name": "tecnologia",
  "description": "Discussões sobre tecnologia",
  "isPrivate": false,
  "isQuarantined": false,
  "createdBy": { "id": "uuid-do-usuario" }
}
```

- **Resposta:** `200 OK` — `Forum` criado

### `PUT /forums/{id}`
Atualiza um fórum. O `id` da URL sobrescreve o do body.

- **Body:** objeto `Forum`
- **Resposta:** `200 OK` — `Forum` atualizado

### `DELETE /forums/{id}`
Remove um fórum.

- **Resposta:** `200 OK`

---

## Postagens — `/posts`

Apenas postagens com `isRemoved = false` aparecem nas listagens por fórum.

### `GET /posts/{id}`
Busca uma postagem por ID.

- **Resposta:** `200 OK` — `Postagem` · `500` se não encontrada

### `GET /posts/forum/{forumId}`
Lista as postagens de um fórum (paginado, apenas não-removidas).

- **Resposta:** `200 OK` — `Page<Postagem>`

### `POST /posts`
Cria uma postagem.

- **Body:**

```json
{
  "forum": { "id": "uuid-do-forum" },
  "user": { "id": "uuid-do-usuario" },
  "title": "Título da postagem",
  "body": "Conteúdo em texto",
  "url": "https://link-opcional.com",
  "isPinned": false
}
```

- **Resposta:** `200 OK` — `Postagem` criada

### `PUT /posts/{id}`
Atualiza uma postagem. O `id` da URL sobrescreve o do body.

- **Resposta:** `200 OK` — `Postagem` atualizada

### `DELETE /posts/{id}`
Remove uma postagem.

- **Resposta:** `200 OK`

---

## Comentários — `/comentarios`

Suporta comentários aninhados (respostas) via `parentComment`. Apenas comentários com `isRemoved = false` aparecem nas listagens.

### `GET /comentarios/{id}`
Busca um comentário por ID.

- **Resposta:** `200 OK` — `Comentario` · `500` se não encontrado

### `GET /comentarios/post/{postId}`
Lista os comentários de uma postagem (paginado, apenas não-removidos).

- **Resposta:** `200 OK` — `Page<Comentario>`

### `GET /comentarios/replies/{parentId}`
Lista as respostas de um comentário pai (paginado, apenas não-removidas).

- **Resposta:** `200 OK` — `Page<Comentario>`

### `POST /comentarios`
Cria um comentário. Para uma resposta, informe `parentComment`.

- **Body:**

```json
{
  "post": { "id": "uuid-da-postagem" },
  "user": { "id": "uuid-do-usuario" },
  "parentComment": { "id": "uuid-do-comentario-pai" },
  "body": "Texto do comentário"
}
```

> `parentComment` é opcional — omita para um comentário de primeiro nível.

- **Resposta:** `200 OK` — `Comentario` criado

### `PUT /comentarios/{id}`
Atualiza um comentário. O `id` da URL sobrescreve o do body.

- **Resposta:** `200 OK` — `Comentario` atualizado

### `DELETE /comentarios/{id}`
Remove um comentário.

- **Resposta:** `200 OK`

---

## Likes — `/likes`

Um like pode referenciar uma **postagem** (`post`) ou um **comentário** (`comment`).

### `POST /likes`
Cria um like.

- **Body (like em postagem):**

```json
{
  "user": { "id": "uuid-do-usuario" },
  "post": { "id": "uuid-da-postagem" }
}
```

- **Body (like em comentário):**

```json
{
  "user": { "id": "uuid-do-usuario" },
  "comment": { "id": "uuid-do-comentario" }
}
```

- **Resposta:** `200 OK` — `Like` criado

### `GET /likes/post/{postId}/count`
Conta os likes de uma postagem.

- **Resposta:** `200 OK` — `long` (número de likes)

### `GET /likes/comment/{commentId}/count`
Conta os likes de um comentário.

- **Resposta:** `200 OK` — `long` (número de likes)

### `DELETE /likes/post/{postId}/user/{userId}`
Remove o like de um usuário em uma postagem (unlike). Não faz nada se o like não existir.

- **Resposta:** `200 OK`

### `DELETE /likes/comment/{commentId}/user/{userId}`
Remove o like de um usuário em um comentário (unlike). Não faz nada se o like não existir.

- **Resposta:** `200 OK`

### `DELETE /likes/{id}`
Remove um like pelo seu ID.

- **Resposta:** `200 OK`

---

## Bans — `/bans`

Banimento de usuários, opcionalmente vinculado a um fórum específico (`forum = null` indica ban global).

### `GET /bans/{id}`
Busca um ban por ID.

- **Resposta:** `200 OK` — `Ban` · `500` se não encontrado

### `GET /bans/user/{userId}`
Lista todos os bans de um usuário.

- **Resposta:** `200 OK` — `List<Ban>`

### `GET /bans/forum/{forumId}`
Lista os bans de um fórum (paginado).

- **Resposta:** `200 OK` — `Page<Ban>`

### `POST /bans`
Cria um ban.

- **Body:**

```json
{
  "user": { "id": "uuid-do-usuario-banido" },
  "forum": { "id": "uuid-do-forum" },
  "bannedBy": { "id": "uuid-do-moderador" },
  "reason": "Motivo do banimento",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

> `forum` é opcional (ban global se omitido). `expiresAt` é opcional (ban permanente se omitido).

- **Resposta:** `200 OK` — `Ban` criado

### `PUT /bans/{id}`
Atualiza um ban. O `id` da URL sobrescreve o do body.

- **Resposta:** `200 OK` — `Ban` atualizado

### `DELETE /bans/{id}`
Remove um ban (revoga o banimento).

- **Resposta:** `200 OK`

---

## Notas técnicas

- **Tratamento de erros:** recursos não encontrados lançam `RuntimeException`, o que resulta em `500 Internal Server Error`. Recomenda-se futuramente adicionar um `@RestControllerAdvice` para mapear esses casos para `404 Not Found`.
- **Relacionamentos:** ao enviar relacionamentos no body, basta informar o objeto aninhado com seu `id` (ex.: `"user": { "id": "..." }`).
- **Timestamps:** `createdAt` e `updatedAt` são gerenciados automaticamente pelo Hibernate e não devem ser enviados no body.
