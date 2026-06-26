# MAGUGI

MAGUGI é uma plataforma de fóruns e comunidades descentralizadas baseada na criação de tópicos, postagens e interações sociais. O sistema garante uma organização hierárquica de permissões que separa responsabilidades entre usuários comuns, moderadores de comunidades específicas e administradores globais da plataforma.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React com TypeScript
* **Back-end:** Java com Spring Boot
* **Banco de Dados:** PostgreSQL

## 👥 Perfis e Permissões (Matriz de Acesso)

O sistema de permissões baseia-se em um controle de acesso rigoroso (RBAC/ABAC) validado em todas as rotas da API.

* **Usuário Comum:** Pode visualizar conteúdo público, criar postagens, comentar, curtir posts, denunciar conteúdos e editar/excluir o próprio conteúdo. Também possui a permissão de criar um novo fórum.
* **Moderador:** Possui todas as permissões de um usuário comum, além de poder remover postagens de terceiros dentro do seu fórum, editar as regras locais e banir ou silenciar usuários específicos da sua comunidade.
* **Administrador:** Tem acesso irrestrito, podendo aplicar banimentos permanentemente na plataforma, recuperar contas deletadas ou suspensas e acessar dados privados, como IP e e-mail dos usuários.

## ⚙️ Requisitos Funcionais Principais

* **Autenticação:** Cadastro de novos usuários (com nome único, e-mail e senha) e login na plataforma.
* **Histórico e Perfil:** Visualização do próprio histórico de postagens, comentários e curtidas.
* **Interação Social:** Criação de postagens com título, texto ou URL, sistema de comentários aninhados (respostas a outros comentários) e curtidas limitadas a apenas uma por usuário por item.
* **Gerenciamento de Conteúdo (Usuário):** Edição ou exclusão das próprias publicações e comentários.
* **Moderação Local:** Ocultação de conteúdos irregulares, banimento local (com justificativa obrigatória), auditoria para desbanir posts e nomeação de novos moderadores pelo criador do fórum.
* **Administração Global:** Banimento de usuários de toda a plataforma, intervenção direta sobre qualquer conteúdo (ignorando a hierarquia de moderadores) e visualização de postagens banidas. Tanto usuários quanto administradores não podem visualizar posts apagados.

## 🔒 Requisitos Não Funcionais e Arquitetura

* **Segurança de Dados:** Uso de UUID como chave primária para todas as tabelas (evitando enumeração e aumentando a segurança), senhas salvas com algoritmo de hash seguro na coluna `password_hash` e proteção contra SQL Injection através do ORM.
* **Performance e Escalabilidade:** Implementação obrigatória de paginação para listagens de postagens, comentários e fóruns, evitando lentidão.
* **Integridade Histórica (Soft Deletes):** A exclusão de registros não realiza um DELETE físico no banco, mas altera a flag `is_removed` para TRUE.
* **Padronização de Tempo:** Todas as datas são salvas no banco de dados utilizando o formato `TIMESTAMPTZ`, delegando a conversão do fuso horário para o front-end.
* **Estratégia de Cache:** O back-end armazena o cache no banco de dados para evitar a repetição de consultas, enquanto o front-end guarda as últimas requisições feitas para evitar o sobrecarregamento.

## 🗄️ Modelo de Dados

A arquitetura do banco reflete o seguinte ecossistema de entidades principais:
* **Usuários:** Tabela central de contas e credenciais.
* **Moderadores:** Comunidades criadas por usuários, relacionadas à tabela de moderadores e suas permissões.
* **Postagens e Comentários:** O conteúdo em si, com rastreamento de autoria, comunidade de destino e comentários aninhados (parentes).
* **Likes:** Tabela documentando as curtidas.
* **Bans:** Registro histórico de penalidades (locais ou globais), contendo o motivo e a data de expiração.

---

## 🚀 Como Executar o Projeto Localmente

O projecto está configurado para arrancar de forma simples usando os scripts `.bat` na raiz.

### Pré-requisitos
- **Java 25** (JDK) — Necessário estar no `PATH`
- **PostgreSQL 18** — A correr na porta padrão (5432) com utilizador `postgres` e senha `postgres`, base de dados `magugi`
- **Node.js** (v20+) — Para o front-end

### 1. Iniciar o Back-end
Pode usar o script automático que configura o Java e liberta a porta:
```powershell
.\start-backend.bat
```
Ou manualmente no terminal (na pasta `C:\Code\magugi-backend\backend`):
```powershell
.\mvnw.cmd spring-boot:run
```

### 2. Iniciar o Front-end
Num terminal separado, na pasta `C:\Code\magugi`:
```powershell
npm run dev
```
Acede a **http://localhost:5173**.

---

## 🔑 Credenciais de Teste

Para efeitos de demonstração e avaliação, as seguintes credenciais estão disponíveis (o back-end encarrega-se de criar o `admin` no arranque):

| Perfil | Username | Password | Notas |
|---|---|---|---|
| **Administrador** | `admin` | `123456` | Acesso ao Painel Admin, pode banir e apagar qualquer post/comentário. |
| **Utilizador Comum** | `comum` | `123456` | Pode criar fóruns, posts, comentar e gerir o próprio conteúdo. |

*(Ao criar um novo fórum sendo um Utilizador Comum, tornas-te automaticamente **Moderador** desse fórum, ganhando permissões para apagar posts de terceiros dentro desse espaço).*

---

## 🛡️ Relatório de Segurança

Os controlos de cibersegurança implementados (exigidos pelos critérios 8 a 15) encontram-se documentados detalhadamente no ficheiro [**RELATORIO_SEGURANCA.md**](./RELATORIO_SEGURANCA.md).
