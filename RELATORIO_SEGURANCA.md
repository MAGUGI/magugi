# Relatório de Cibersegurança e Conformidade

Este relatório documenta a arquitetura de segurança implementada na plataforma MAGUGI, evidenciando o cumprimento dos rigorosos critérios estabelecidos, nomeadamente as questões de controlo de acesso, gestão de identidade, integridade de dados e proteção da API.

---

## 1. Gestão de Identidade e Autenticação

A aplicação utiliza um sistema robusto de autenticação baseado em JSON Web Tokens (JWT). As decisões tomadas visam minimizar a superfície de ataque:

- **Tokens em Cookies HttpOnly:** Para mitigar ataques de *Cross-Site Scripting (XSS)*, o token JWT gerado aquando do login é armazenado num cookie com as flags `HttpOnly` e `Secure` (em produção). Deste modo, o JavaScript do cliente (front-end) não tem acesso direto ao token.
- **Armazenamento de Senhas (Hashing):** O back-end utiliza a biblioteca BCrypt para aplicar um hash criptográfico seguro (com *salt*) antes de gravar qualquer senha na base de dados (`password_hash`), impossibilitando a leitura de senhas em caso de fuga de dados.
- **CORS Configurado de Forma Restrita:** A API (`SecurityConfig.java`) autoriza explicitamente a origem do front-end (`http://localhost:5173`) com `allowCredentials(true)`, em vez de utilizar um wildcard (`*`), prevenindo acessos indevidos por domínios maliciosos.

---

## 2. Controlo de Acessos (RBAC - Matriz de Privilégios)

A plataforma implementa um Controlo de Acessos Baseado em Funções (*Role-Based Access Control*) que se manifesta tanto no back-end (endpoints protegidos) como no front-end (renderização condicional e *Route Guards*).

### Matriz de Acesso Implementada

| Ação / Recurso | Utilizador Comum | Moderador (do Fórum) | Administrador (Global) |
|---|---|---|---|
| **Ver Fóruns/Posts** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Criar Fóruns/Posts** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Editar Próprio Post** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Apagar Próprio Post/Comentário** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Apagar Post/Comentário de Terceiros**| ❌ Não | ✅ Sim (só no seu fórum) | ✅ Sim (em qualquer lado) |
| **Banir Utilizador (Globalmente)** | ❌ Não | ❌ Não | ✅ Sim |
| **Aceder ao Painel Admin** | ❌ Não | ❌ Não | ✅ Sim |

### Implementação Técnica
- No **Back-end**, as anotações `@PreAuthorize` garantem que, mesmo que o atacante force o envio de um pedido HTTP, a API verifica o contexto de segurança (`SecurityContextHolder`).
- No **Front-end**, os componentes (`AdminRoute.tsx` e `ProtectedRoute.tsx`) protegem a navegação. Elementos da UI sensíveis (como os botões de Editar/Apagar em `PostDetail.tsx`) são omitidos caso a condição `isOwner || isAdmin` seja falsa.

---

## 3. Prevenção e Tratamento de Incidentes

- **Registo Histórico de Bans (`BanHistory`):** Foi criada uma tabela específica para auditoria e histórico de bans. Nenhuma penalidade é aplicada sem registo de "motivo" e "quem aplicou". O Painel Admin reflete estas operações.
- **Feedback Seguro e Resposta Visual (Error Handling):** A aplicação utiliza Interceptors do Axios. Em vez de simplesmente "partir", a UI apanha ativamente falhas 401 (Não Autenticado) e 403 (Acesso Negado/Proibido) e apresenta *toasts* claros ao utilizador. Aceder ao painel Admin como utilizador comum redireciona para um componente gráfico específico de `UnauthorizedPage` ou devolve feedback visual, evitando a exposição de lógicas da framework.

---

## 4. Proteção de Dados (Soft Deletes e Integridade)

- **Soft Delete:** Para assegurar a integridade histórica (exigência para efeitos legais ou auditorias), os registos (como Postagens e Comentários) não sofrem um `DELETE` físico imediato da base de dados. Utiliza-se a flag booleana `is_removed`. O utilizador deixa de os ver, mas o dado persiste.
- **Ocultação de Informação Privada:** Dados sensíveis como o e-mail ou IP dos utilizadores nunca são expostos abertamente. O e-mail apenas é vísivel pelo próprio dono do perfil ou por administradores da plataforma (através do Painel de Administração). 
- **UUID como Identificadores Padrão:** O ID dos utilizadores, posts, fóruns e comentários é gerado através da estratégia `UUID`. Desta forma, inibe-se ataques de Insecure Direct Object Reference (IDOR) baseados na enumeração sequencial (tentar `id=1`, depois `id=2`).

---

## 5. Plano Inicial de Backup e Restauro (Disaster Recovery)

Para garantir a alta disponibilidade e integridade a longo prazo, definimos o seguinte plano inicial:
- **Backup de Dados (PostgreSQL):** Configuração de um script automatizado via `pg_dump` para realizar backups diários completos (*full backups*) da base de dados `magugi` durante a madrugada.
- **Armazenamento:** Os ficheiros gerados pelo `.sql` ou `.dump` serão encriptados e armazenados num volume de objectos cloud separado fisicamente do servidor (ex: AWS S3 ou equivalente).
- **Testes de Restauro:** Será agendado um teste trimestral obrigatório onde uma réplica da infraestrutura receberá o comando `pg_restore` do último backup validado, garantindo que o RTO (Recovery Time Objective) se mantém abaixo de 2 horas.

---

## Conclusão

A integração total entre React, Zustand (estado global seguro) e Spring Boot (com Spring Security) resultou numa plataforma MAGUGI que garante não só a usabilidade exigida num fórum moderno, mas, acima de tudo, o cumprimento rigoroso dos standards de segurança e controlo de acessos esperados num sistema real de nível empresarial.
