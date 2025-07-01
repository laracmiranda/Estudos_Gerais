# Como trabalhar em projetos colaborativos? 🤝
Abaixo seguem algumas dicas de git em conjunto com o github sobre como trabalhar em projetos colaborativos com duas ou mais pessoas para que ele fique organizado e evitando possívels conflitos.

---

## 1️⃣ ETAPA 1 — Criar o Repositório Principal no GitHub

1. Acesse [https://github.com](https://github.com).
2. Clique em **New Repository**.
3. Escolha:

   * Nome do repositório (ex: `teste`).
   * Visibilidade: `Public` ou `Private`.
   * Se quiser, marque a opção `Initialize this repository with a README`.
4. Clique em **Create repository**.

---

## 2️⃣ ETAPA 2 — Clonar o repositório na sua máquina

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

---

## 3️⃣ ETAPA 3 — Criar uma branch para sua feature (nunca trabalhe direto na `main`)

### Nomeie as branches com o padrão:

* `feature/nome-da-feature`
* `fix/ajuste-x`
* `hotfix/urgente-y`

### Exemplo:

```bash
git checkout -b feature/formulario-login
```

---

## 4️⃣ ETAPA 4 — Trabalhar localmente na sua branch

1. Faça suas alterações no código.
2. Adicione os arquivos modificados:

```bash
git add .
```

3. Faça o commit com uma mensagem clara:

```bash
git commit -m "feat: cria formulário de login com validação"
```

---

## 5️⃣ ETAPA 5 — Subir sua branch para o GitHub

```bash
git push origin feature/formulario-login
```

---

## 6️⃣ ETAPA 6 — Criar um Pull Request (PR)

1. Vá até o GitHub.
2. O GitHub vai sugerir: “Compare & pull request”.
3. Clique e preencha:

   * Título do PR (ex: `feat: adiciona formulário de login`)
   * Descrição do que foi feito, prints se possível
4. Escolha a base como `main` e compare com sua branch.
5. Clique em **Create pull request**.

---

## 7️⃣ ETAPA 7 — Revisar e Mesclar o Pull Request (se tiver permissão)

1. Outro dev pode revisar seu código, comentar ou aprovar.
2. Após aprovação, clique em **Merge pull request**.
3. Em seguida, clique em **Confirm merge**.
4. (Opcional) Delete a branch: o GitHub oferece essa opção.

---

## 8️⃣ ETAPA 8 — Puxar as mudanças mais recentes da main

**Antes de iniciar uma nova task, sincronize sua `main`:**

```bash
git checkout main
git pull origin main
```

---

## 9️⃣ ETAPA 9 — Rebase ou merge da main em sua nova branch (opcional, para evitar conflitos)

Antes de começar uma nova feature:

```bash
git checkout -b feature/nova-tarefa
git rebase main  # ou: git merge main
```

---

## ⭐ DICAS EXTRAS

### 📌 Para ver o status do seu repositório:

```bash
git status
```

### 📌 Para ver as branches disponíveis:

```bash
git branch           # locais
git branch -r        # remotas
```

### 📌 Para trocar de branch:

```bash
git checkout nome-da-branch
```

---

## 📝 FLUXO RESUMIDO

```plaintext
main ←— Pull Request ←— feature/xyz
 ↑                            ↓
Sempre atualize           Crie nova branch
```