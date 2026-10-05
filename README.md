<!--
  GitHub Profile README for Saumil
  Positioning: systems designer (software architecture by day) who stays hands-on after hours.
  Generated pieces: assets/profile-banner-*.svg (scripts/generate-banners.js),
  assets/cards/*.svg (scripts/generate-cards.js), DASHBOARD block (scripts/update-dashboard.js).
-->

<p align="center">
  <picture>
    <source srcset="assets/profile-banner-dark.svg" media="(prefers-color-scheme: dark)" />
    <source srcset="assets/profile-banner-light.svg" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
    <img src="assets/profile-banner-light.svg" alt="Saumil — systems designer, hands-on" width="100%" />
  </picture>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1400&center=true&vCenter=true&width=760&height=32&color=7AA2F7&lines=Systems+designer+%C2%B7+hands-on;Service+boundaries+%C2%B7+resilience+%C2%B7+platform+standards;Rust+async+%C2%B7+DDD+%C2%B7+distributed+systems" alt="Systems designer, hands-on. Service boundaries, resilience, platform standards." />
</p>

<p align="center">
  <a href="https://saumilp.dev"><img src="https://img.shields.io/badge/Portfolio-saumilp.dev-7AA2F7?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=1a1b26" alt="Portfolio" /></a>
  <a href="https://github.com/SaumilP?tab=repositories"><img src="https://img.shields.io/github/followers/SaumilP?style=for-the-badge&logo=github&label=Followers&color=9ECE6A&labelColor=1a1b26" alt="GitHub followers" /></a>
  <img src="https://komarev.com/ghpvc/?username=SaumilP&style=for-the-badge&label=Profile+views&color=BB9AF7&labelColor=1a1b26" alt="Profile views" />
</p>

I'm a systems designer who stays hands-on. By day I work in software architecture, designing systems and setting standards; after hours I build reference implementations and tools so my decisions stay grounded in working code.

| When | What I do |
|------|-----------|
| **Day job** | Designing systems, recording decisions, setting standards, reviewing trade-offs. |
| **After hours** | Reference implementations, patterns and Rust tooling. Everything on this profile is personal-time work, built to keep my judgment sharp. |

---

## What I focus on

| Area | What it looks like in practice |
|------|--------------------------------|
| **Service design and boundaries** | Domain-driven design, modular monoliths before microservices, clear ownership and contracts |
| **Resilience and observability** | Timeouts, retries and backpressure designed up front; traces, metrics and logs treated as part of the design |
| **API and integration design** | REST contracts, messaging, idempotency, versioning that does not break consumers |
| **Platform and governance** | Shared starters, golden paths, CI/CD standards so teams spend their effort on the domain |

<p align="center">
  <sub>Day to day:</sub>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" />
</p>

---

## How I design

1. **Start from the boundary, not the framework.** Where responsibility ends matters more than which library sits inside it.
2. **Write the decision down.** Context, options considered, and what we gave up. A short ADR beats a long memory.
3. **Design for failure first.** Decide what happens when a dependency is slow or down before adding the feature.
4. **Standardise the boring parts.** Starters and golden paths remove repeated decisions so the interesting ones get attention.
5. **Prefer decisions that are cheap to reverse.** When unsure, pick the option that is easiest to change later.

---

## Flagship: a reference platform for testing design decisions

> **Status: in progress.** The design below is the target. Nothing here is shipped yet, and each decision is marked *proposed* until the ADR is written and the code backs it up.

A place to prototype architectural decisions with working code before relying on them. It applies the principles above in a modular service built with my own [Spring Boot starters](https://github.com/SaumilP/spring-boot-starters), documented with [C4 diagrams](https://github.com/SaumilP/drawio_libraries), and run with observability and deployment governance from day one.

```mermaid
flowchart LR
    client([Client]) --> gw[API Gateway]
    gw --> orders[Orders module]
    gw --> inventory[Inventory module]
    orders --> pg[(PostgreSQL)]
    inventory --> pg
    orders -- outbox --> broker{Message broker}
    broker --> notify[Notifications]
    orders -.-> otel[OpenTelemetry]
    inventory -.-> otel
    notify -.-> otel
    otel -.-> dash[Dashboards and alerts]
```

| ADR | Decision | Question it answers | Status |
|-----|----------|---------------------|--------|
| 001 | Modular monolith first, split later | When is a service boundary worth a network hop? | Proposed |
| 002 | Transactional outbox for events | How do we publish events without losing or duplicating them? | Proposed |
| 003 | OpenTelemetry through a shared starter | How do teams get consistent traces and metrics for free? | Proposed |
| 004 | Policy checks in the deployment pipeline | How is governance enforced without slowing delivery? | Proposed |

**Planned artifacts:** C4 context and container diagrams, the four ADRs above, failure-mode notes (what breaks and how it degrades), and load-test results.

---

## Reference architecture and patterns

<sub>Worked examples of decisions I would make in practice, kept runnable and documented. Start with <a href="https://github.com/SaumilP/design-patterns">design-patterns</a> for decisions in code and <a href="https://github.com/SaumilP/drawio_libraries">drawio_libraries</a> for diagrams.</sub>

<table>
<tr>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/design-patterns"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-design-patterns-dark.svg" />
  <img src="assets/cards/pin-design-patterns-light.svg" alt="design-patterns" width="100%" />
</picture></a>
</td>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/enterprise-spring-patterns-and-recipes"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-enterprise-spring-patterns-and-recipes-dark.svg" />
  <img src="assets/cards/pin-enterprise-spring-patterns-and-recipes-light.svg" alt="enterprise-spring-patterns-and-recipes" width="100%" />
</picture></a>
</td>
</tr>
<tr>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/spring-boot-starters"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-spring-boot-starters-dark.svg" />
  <img src="assets/cards/pin-spring-boot-starters-light.svg" alt="spring-boot-starters" width="100%" />
</picture></a>
</td>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/drawio_libraries"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-drawio_libraries-dark.svg" />
  <img src="assets/cards/pin-drawio_libraries-light.svg" alt="drawio_libraries" width="100%" />
</picture></a>
</td>
</tr>
</table>

## Hands-on builds

<sub>Tools I build to stay close to the code: CLIs and automation, mostly in Rust.</sub>

<table>
<tr>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/mastodon-toot-client"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-mastodon-toot-client-dark.svg" />
  <img src="assets/cards/pin-mastodon-toot-client-light.svg" alt="mastodon-toot-client" width="100%" />
</picture></a>
</td>
<td width="50%" align="center" valign="top">
<a href="https://github.com/SaumilP/gh-yule-gitlog-rs"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/pin-gh-yule-gitlog-rs-dark.svg" />
  <img src="assets/cards/pin-gh-yule-gitlog-rs-light.svg" alt="gh-yule-gitlog-rs" width="100%" />
</picture></a>
</td>
</tr>
</table>

<p align="center">
  More: <a href="https://github.com/SaumilP/changeloggen-cli">changeloggen-cli</a> ·
  <a href="https://github.com/SaumilP/rust-learning-lab">rust-learning-lab</a> ·
  <a href="https://github.com/SaumilP?tab=repositories">all repositories</a>
</p>

---

## Activity

<table>
<tr>
<td width="50%" align="center" valign="top">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/stats-dark.svg" />
  <img src="assets/cards/stats-light.svg" alt="GitHub overview" width="100%" />
</picture>
</td>
<td width="50%" align="center" valign="top">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/languages-dark.svg" />
  <img src="assets/cards/languages-light.svg" alt="Top languages" width="100%" />
</picture>
</td>
</tr>
</table>

<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/cards/impact-dark.svg" />
  <img src="assets/cards/impact-light.svg" alt="Contributions over the past year" width="100%" />
</picture>
</p>

<p align="center"><sub>Cards come from <a href="https://gh-stats-plum-five.vercel.app/">gh-stats</a> and are rebuilt weekly.</sub></p>

---

## Currently exploring

<table>
<tr>
<td width="50%" valign="top">

**Design questions I'm testing**
- Context boundaries and aggregates in DDD
- Consistency and messaging trade-offs in distributed systems
- Observability-led design
- Clean Architecture in modular Spring Boot

</td>
<td width="50%" valign="top">

**Engineering I'm practising**
- Rust async patterns
- CLI tools and automation in Rust
- Local-first workflows
- Backend performance patterns

</td>
</tr>
</table>

---

## Developer dashboard

<!-- DASHBOARD:START -->
| Metric | Value |
|--------|-------|
| 🚀 Repositories (public) | 61 |
| 🌱 Recent Activity | DeleteEvent on SaumilP/gh-stats (2026-09-14) |
| 🧪 Last Updated | 2026-10-05 19:18 UTC |
<!-- DASHBOARD:END -->

---

## Connect

<p align="center">
  <a href="https://saumilp.dev"><img src="https://img.shields.io/badge/Website-saumilp.dev-7AA2F7?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=1a1b26" alt="Website" /></a>
  <a href="https://github.com/SaumilP"><img src="https://img.shields.io/badge/GitHub-SaumilP-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>
