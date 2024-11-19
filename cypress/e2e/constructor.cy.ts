/// <reference types="cypress" />

const BUNS_INGREDIENTS = '[data-cy=buns-ingredients]';
const TOP_BUN_CONSTRUCTOR = '[data-cy=constructor-bun-1]';
const BOTTOM_BUN_CONSTRUCTOR = '[data-cy=constructor-bun-2]';
const MAIN_INGREDIENTS_CONSTRUCTOR = '[data-cy=constructor-main]';
const MAIN_INGREDIENTS = '[data-cy=mains-ingredients]';
const MODAL = '[data-cy=modal]';
const MODAL_CLOSE_BUTTON = '[data-cy=modal__close-button]';

describe('добавляем ингредиент в конструктор', function () {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('добавление булки в конструктор', () => {
    cy.get(BUNS_INGREDIENTS).contains('Добавить').click();
    cy.get(TOP_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
    cy.get(BOTTOM_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
  });

  it('добавление булки и котлеты', () => {
    cy.get(BUNS_INGREDIENTS).contains('Добавить').click();
    cy.get(MAIN_INGREDIENTS).contains('Добавить').click();
    cy.get(TOP_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
    cy.get(BOTTOM_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
    cy.get(MAIN_INGREDIENTS_CONSTRUCTOR)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});

describe('тест модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('открытие модального окна', () => {
    cy.get(BUNS_INGREDIENTS).contains('Краторная булка').click();
    cy.get(MODAL).should('exist');
  });

  it('открытие модального окна и закрытие на крестик', () => {
    cy.get(BUNS_INGREDIENTS).contains('Краторная булка').click();
    cy.get(MODAL).should('exist');
    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');
  });

  it('открытие модального окна и закрытие на оверлей', () => {
    cy.get(BUNS_INGREDIENTS).contains('Краторная булка').click();
    cy.get(MODAL).should('exist');
    cy.get('[data-cy=modal__overlay]').click('left', { force: true });
    cy.get(MODAL).should('not.exist');
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
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('заказ бургера из краторной булки и биокотлеты', () => {
    cy.get(BUNS_INGREDIENTS).contains('Добавить').click();
    cy.get(MAIN_INGREDIENTS).contains('Добавить').click();
    cy.get(TOP_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
    cy.get(BOTTOM_BUN_CONSTRUCTOR).contains('Краторная булка').should('exist');
    cy.get(MAIN_INGREDIENTS_CONSTRUCTOR)
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

    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    cy.get(TOP_BUN_CONSTRUCTOR).should('not.exist');
    cy.get(BOTTOM_BUN_CONSTRUCTOR).should('not.exist');
    cy.get(MAIN_INGREDIENTS_CONSTRUCTOR)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
  });
});
