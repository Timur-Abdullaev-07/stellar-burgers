/// <reference types="cypress" />

describe('добавляем ингредиент в конструктор', function () {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('добавление булки в конструктор', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка')
      .should('exist');
  });
  it('добавление булки и котлеты', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка')
      .should('exist');
    cy.get('[data-cy=constructor-main]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});

describe('тест модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('открытие модального окна', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Краторная булка').click();
    cy.get('[data-cy=modal]').should('exist');
  });

  it('открытие модального окна и закрытие на крестик', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Краторная булка').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal__close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('открытие модального окна и закрытие на оверлей', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Краторная булка').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal__overlay]').click('left', { force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});

describe('оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'postOrder.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('заказ бургера из краторной булки и биокотлеты', () => {
    cy.get('[data-cy=buns-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка')
      .should('exist');
    cy.get('[data-cy=constructor-main]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');

    cy.get('[data-cy=constructor__order-button]')
      .contains('Оформить заказ')
      .click();

    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa093c'
        ]
      });

    cy.get('[data-cy=order-number]').contains('59648').should('exist');

    cy.get('[data-cy=modal__close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get('[data-cy=constructor-main]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
  });
});
