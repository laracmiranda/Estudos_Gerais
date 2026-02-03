# 🕹️ Adicionando o Pac-Man no GitHub

Este repositório contém um **tutorial passo a passo** para adicionar a animação do **Pac-Man no gráfico de contribuições do GitHub** usando GitHub Actions.

---

## 📌 Pré-requisitos

* Ter um repositório com o **mesmo nome do seu usuário do GitHub**
* Esse repositório será usado como **README do perfil**

---

## 🚀 Passo 1: Criar o Workflow no GitHub Actions

1. Acesse o seu **repositório principal** (com o nome do seu usuário).
2. Vá até:
   **Actions → New workflow → Set up a workflow yourself**
3. Copie e cole o código abaixo:

```yml
name: Generate pacman animation

on:
  schedule: # executa a cada 12 horas
    - cron: "* */12 * * *"

  workflow_dispatch:

  push:
    branches:
      - main

jobs:
  generate:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Generate pacman contribution graph
        uses: abozanona/pacman-contribution-graph@main
        with:
          github_user_name: ${{ github.repository_owner }}

      - name: Push pacman graph to output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

4. **Commit** as mudanças.

---

## 📝 Passo 2: Atualizar o README do Perfil

1. Abra o arquivo `README.md` do seu perfil

   > Caso não exista, crie um.
2. Clique em **Edit**.
3. Adicione o código abaixo no local desejado do README:

```html
<picture>
  <source 
    media="(prefers-color-scheme: dark)" 
    srcset="https://raw.githubusercontent.com/seu-usuario/seu-usuario/output/pacman-contribution-graph-dark.svg"
  >
  <source 
    media="(prefers-color-scheme: light)" 
    srcset="https://raw.githubusercontent.com/seu-usuario/seu-usuario/output/pacman-contribution-graph.svg"
  >
  <img 
    alt="Pacman contribution graph" 
    src="https://raw.githubusercontent.com/seu-usuario/seu-usuario/output/pacman-contribution-graph.svg"
  >
</picture>
```

🔁 **Importante:** substitua `seu-usuario` pelo seu username do GitHub.

4. **Commit** as mudanças.

---

## ✅ Resultado Final

Pronto! 🤘
O **Pac-Man agora aparecerá animado no gráfico de contribuições do seu perfil**, atualizando automaticamente a cada 12h.
