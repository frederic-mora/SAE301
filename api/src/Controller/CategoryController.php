
<?php
require_once __DIR__ . '/EntityController.php';
require_once __DIR__ . '/../Repository/CategoryRepository.php';
require_once __DIR__ . '/../Class/Category.php';

class CategoryController extends EntityController {

    private CategoryRepository $repository;

    public function __construct() {
        $this->repository = new CategoryRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $segment = $request->getId(); // peut être id numérique ou nom de catégorie

        if ($segment) {
            // normaliser le segment provenant de l'URL
            $segment = trim(urldecode((string)$segment));

            if (is_numeric($segment)) {
                // on passe l'id numérique au repository (géré par findAllByCategory)
                return $this->repository->findAllByCategory((int)$segment);
            } else {
                // nom de catégorie
                return $this->repository->findAllByCategory($segment);
            }
        } else {
            $category = $request->getParam("category");
            if ($category) {
                return $this->repository->findAllByCategory(trim(urldecode((string)$category)));
            }

            return $this->repository->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);

        if (!isset($obj->name)) {
            return false;
        }

        $entity = new Category(0);
        $entity->setName($obj->name);

        $ok = $this->repository->save($entity);
        return $ok ? $entity : false;
    }
}
